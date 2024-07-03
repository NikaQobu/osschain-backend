import json
import logging
import requests
from django.http import JsonResponse
from web3 import Web3
from osschain.client_rescrict import is_rate_limited, get_client_ip
from osschain import env

# Constants for de.fi API
DEFI_API_URL = "https://api.de.fi/swap"
DEFI_API_KEY = "your_api_key_here"  # Replace with your actual API key


def swap_tokens(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_swap_tokens"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)
        try:
            data = json.loads(request.body.decode("utf-8"))
            wallet_address = data.get("wallet_address")
            from_token = data.get("from_token")
            to_token = data.get("to_token")
            amount = data.get("amount")
            blockchain = data.get("blockchain")

            if not all([wallet_address, from_token, to_token, amount, blockchain]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Convert addresses to checksum format
            wallet_address = Web3.to_checksum_address(wallet_address)

            # Define RPC URLs for supported blockchains
            rpc_url = env.get_blockchain_rpc_node(blockchain)
            if not rpc_url:
                return JsonResponse({'success': False, 'error': 'Unsupported blockchain'}, status=400)

            # Prepare the swap request payload
            payload = {
                "wallet_address": wallet_address,
                "from_token": from_token,
                "to_token": to_token,
                "amount": amount,
                "blockchain": blockchain
            }

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {DEFI_API_KEY}"
            }

            # Perform the API call to execute the swap
            response = requests.post(DEFI_API_URL, headers=headers, json=payload)

            if response.status_code == 200:
                response_data = response.json()
                return JsonResponse({
                    'success': True,
                    'message': 'Token swap completed successfully',
                    'swap_info': response_data,
                    'status': 200
                })
            else:
                logging.error(f"Error in swap_tokens: {response.status_code} {response.text}")
                return JsonResponse({'error': 'Error performing token swap'}, status=response.status_code)

        except Exception as e:
            logging.error(f"Error in swap_tokens: {str(e)}")
            return JsonResponse({'error': 'An unexpected error occurred: ' + str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
