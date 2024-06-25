from django.http import JsonResponse
import json
from web3 import Web3
from django.core.cache import cache
import logging
import requests
from osschain.client_rescrict import is_rate_limited, get_client_ip
from osschain import env

# Updated get_account_balance function
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

            # Fetch balance
            balance_wei = web3.eth.get_balance(wallet_address)
            balance_eth = web3.from_wei(balance_wei, 'ether')

            return JsonResponse({
                'success': True,
                'message': 'Request completed successfully',
                'balance': str(balance_eth),
                'status': 200
            })

        except Exception as e:
            logging.error(f"Error in get_account_balance: {str(e)}")
            return JsonResponse({'error': 'An unexpected error occurred: ' + str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
