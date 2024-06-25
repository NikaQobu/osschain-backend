from django.http import JsonResponse
import requests
import json
from osschain import env
import logging
from web3 import Web3
from web3.middleware import geth_poa_middleware
from osschain.client_rescrict import is_rate_limited, get_client_ip

def get_token_transfer(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_get_token_transfer"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)
        
        response = json.loads(request.body.decode("utf-8"))
        wallet_address = response.get("wallet_address")
        blockchain = response.get("blockchain")
        page_size = response.get("page_size")
        id = response.get("id")
        page_token = response.get("page_token")

        try:
            if blockchain == "ethereum":
                api_url = f"https://api.tatum.io/v3/ethereum/account/transaction/{wallet_address}"
            elif blockchain == "bsc":
                api_url = f"https://api.tatum.io/v3/bsc/account/transaction/{wallet_address}"
            elif blockchain == "polygon":
                api_url = f"https://api.tatum.io/v3/polygon/account/transaction/{wallet_address}"
            else:
                return JsonResponse({'success': False, 'error': 'Unsupported blockchain'}, status=400)
            
            params = {
                "pageSize": page_size,
                "offset": page_token if page_token else 0
            }

            response = requests.get(api_url, headers=env.api_tatum_header, params=params)
            response.raise_for_status()
            
            ans = response.json()
            if ans:
                data = {
                    "success": True,
                    "message": "Request completed successfully",
                    "ans": ans,
                    "status": 200
                }
            else:
                data = {
                    "success": False,
                    "message": "Answer does not exist",
                    "status": 404
                }

            return JsonResponse(data, status=data.get("status"), json_dumps_params={'ensure_ascii': False})

        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Failed to parse response'}, status=500)
        except Exception as e:
            return JsonResponse({'error': 'An unexpected error occurred: ' + str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)



def get_transactions_by_address(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_get_transactions_by_address"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)

        try:
            response = json.loads(request.body.decode("utf-8"))
            wallet_address = response.get("wallet_address")
            blockchain = response.get("blockchain")
            page_size = response.get("page_size", 10)
            page_token = response.get("page_token", 0)

            if not wallet_address or not blockchain:
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            rpc_url = env.get_blockchain_rpc_node(blockchain)
            if not rpc_url:
                return JsonResponse({'success': False, 'error': 'Unsupported blockchain'}, status=400)

            web3 = Web3(Web3.HTTPProvider(rpc_url))
            # Apply the PoA middleware
            if blockchain.lower() in ['polygon', 'bsc', 'xdai', 'arbitrum', 'fantom', 'klaytn', 'moonriver']:
                web3.middleware_onion.inject(geth_poa_middleware, layer=0)

            if not web3.is_connected():
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)

            latest_block = web3.eth.block_number
            logging.info(f"Latest block: {latest_block}")

            start_block = max(0, latest_block - (page_size * (page_token if page_token else 0)))
            end_block = min(latest_block, start_block + page_size)
            logging.info(f"Start block: {start_block}, End block: {end_block}")

            transactions = []
            for block_number in range(start_block, end_block):
                try:
                    block = web3.eth.get_block(block_number, full_transactions=True)
                    for tx in block.transactions:
                        if tx['from'] == wallet_address or tx['to'] == wallet_address:
                            transactions.append(tx)
                except Exception as e:
                    logging.error(f"Error retrieving block {block_number}: {str(e)}")
                    continue  # Skip to the next block if there is an error

            if transactions:
                data = {
                    "success": True,
                    "message": "Request completed successfully",
                    "transactions": transactions,
                    "status": 200
                }
            else:
                data = {
                    "success": False,
                    "message": "No transactions found for the given wallet address",
                    "status": 404
                }

            return JsonResponse(data, status=data.get("status"), json_dumps_params={'ensure_ascii': False})

        except Exception as e:
            logging.error(f"Error in get_transactions_by_address: {str(e)}")
            return JsonResponse({'success': False, 'error': 'An unexpected error occurred: ' + str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)