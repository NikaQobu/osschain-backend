from django.http import JsonResponse
import json
from web3 import Web3
import logging
from osschain.client_rescrict import is_rate_limited, get_client_ip
from osschain import env

def get_erc20_balance(web3, wallet_address, token_address):
    contract = web3.eth.contract(address=token_address, abi=env.ERC20_ABI)
    balance = contract.functions.balanceOf(wallet_address).call()
    return web3.from_wei(balance, 'ether')

def get_account_balance(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_get_account_balance"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)
        try:
            data = json.loads(request.body.decode("utf-8"))
            wallet_address = data.get("wallet_address")
            blockchain = data.get("blockchain")
            token_contract_address = data.get("token_contract_address", None)

            if not all([wallet_address, blockchain]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Convert address to checksum format
            wallet_address = Web3.to_checksum_address(wallet_address)

            # Define RPC URLs for supported blockchains
            rpc_url = env.get_blockchain_rpc_node(blockchain)
            if not rpc_url:
                return JsonResponse({'success': False, 'error': 'Unsupported blockchain'}, status=400)
            
            # Connect to the blockchain using the appropriate RPC URL
            web3 = Web3(Web3.HTTPProvider(rpc_url))

            if not web3.is_connected():
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)

            if token_contract_address:
                # Convert contract address to checksum format
                token_contract_address = Web3.to_checksum_address(token_contract_address)
                # Fetch token balance
                try:
                    token_balance = get_erc20_balance(web3, wallet_address, token_contract_address)
                    return JsonResponse({
                        'success': True,
                        'message': 'Request completed successfully',
                        'token_balance': str(token_balance),
                        'status': 200
                    })
                except Exception as token_error:
                    logging.error(f"Error fetching token balance for {token_contract_address}: {str(token_error)}")
                    return JsonResponse({'error': 'Error fetching token balance'}, status=500)
            else:
                # Fetch native currency balance
                balance_wei = web3.eth.get_balance(wallet_address)
                balance_native = web3.from_wei(balance_wei, 'ether')
                return JsonResponse({
                    'success': True,
                    'message': 'Request completed successfully',
                    'balance_native': str(balance_native),
                    'status': 200
                })

        except Exception as e:
            logging.error(f"Error in get_account_balance: {str(e)}")
            return JsonResponse({'error': 'An unexpected error occurred: ' + str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
