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



def get_transaction_by_address(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_get_transaction_by_address"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)

        response = json.loads(request.body.decode("utf-8"))
        wallet_address = response.get("wallet_address")
        blockchain = response.get("blockchain")
        page_size = response.get("page_size", 10)
        page_token = response.get("page_token")

        if not wallet_address:
            return JsonResponse({'success': False, 'error': 'wallet_address must be provided'}, status=400)

        if blockchain not in ["ethereum", "bsc", "polygon"]:
            return JsonResponse({'success': False, 'error': 'Unsupported blockchain'}, status=400)

        try:
            if blockchain == "ethereum":
                api_url = f"https://api.tatum.io/v3/ethereum/account/transaction/{wallet_address}"
            elif blockchain == "bsc":
                api_url = f"https://api.tatum.io/v3/bsc/account/transaction/{wallet_address}"
            elif blockchain == "polygon":
                api_url = f"https://api.tatum.io/v3/polygon/account/transaction/{wallet_address}"

            params = {
                "pageSize": page_size,
            }
            if page_token:
                params["offset"] = page_token

            response = requests.get(api_url, headers=env.api_tatum_header, params=params)
            response.raise_for_status()
            ans = response.json()

            data = {
                "success": True,
                "wallet_address": wallet_address,
                "transactions": ans
            }

            return JsonResponse(data, json_dumps_params={'ensure_ascii': False})

        except requests.exceptions.RequestException as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
        except json.JSONDecodeError as e:
            return JsonResponse({'success': False, 'error': 'Failed to parse response'}, status=500)
        except Exception as e:
            return JsonResponse({'success': False, 'error': 'An unexpected error occurred: ' + str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
    

def get_nft_transactions(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_get_nft_transactions"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)

        response = json.loads(request.body.decode("utf-8"))
        wallet_address = response.get("wallet_address")
        blockchain = response.get("blockchain")
        page_size = response.get("page_size", 10)
        page_token = response.get("page_token")

        if not wallet_address:
            return JsonResponse({'success': False, 'error': 'wallet_address must be provided'}, status=400)

        if blockchain not in ["ethereum", "bsc", "polygon"]:
            return JsonResponse({'success': False, 'error': 'Unsupported blockchain'}, status=400)

        try:
            if blockchain == "ethereum":
                api_url = f"https://api.tatum.io/v3/nft/transaction/ETH/{wallet_address}"
            elif blockchain == "bsc":
                api_url = f"https://api.tatum.io/v3/nft/transaction/BSC/{wallet_address}"
            elif blockchain == "polygon":
                api_url = f"https://api.tatum.io/v3/nft/transaction/POLYGON/{wallet_address}"

            params = {
                "pageSize": page_size,
            }
            if page_token:
                params["offset"] = page_token

            headers = {
                "x-api-key": "t-6677f6476c8488001c9beb60-eeb7b8b6b03749d19cd21df2",
                "Content-Type": "application/json"
            }

            # Log the URL and params for debugging
            logging.info(f"API URL: {api_url}")
            logging.info(f"Params: {params}")
            logging.info(f"Headers: {headers}")

            response = requests.get(api_url, headers=headers, params=params)
            response.raise_for_status()
            ans = response.json()

            data = {
                "success": True,
                "wallet_address": wallet_address,
                "nft_transactions": ans
            }

            return JsonResponse(data, json_dumps_params={'ensure_ascii': False})

        except requests.exceptions.RequestException as e:
            logging.error(f"Request exception: {e}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
        except json.JSONDecodeError as e:
            logging.error(f"JSON decode error: {e}")
            return JsonResponse({'success': False, 'error': 'Failed to parse response'}, status=500)
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return JsonResponse({'success': False, 'error': 'An unexpected error occurred: ' + str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)