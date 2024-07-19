import requests
import json
from osschain import env
from django.http import JsonResponse, HttpResponse
from osschain.client_rescrict import is_rate_limited, get_client_ip


def get_token_transfer(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_calculate_chain_gas_price"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)
        
        response = json.loads(request.body.decode("utf-8"))
        wallet_address = response.get("wallet_address")
        blockchain = response.get("blockchain")
        page_size = response.get("page_size")
        id = response.get("id")
        page_token = response.get("page_token")
        try:
            payload = {
                "id": id,
                "jsonrpc": "2.0",
                "method": "ankr_getTokenTransfers",
                
                "params": {
                    "blockchain": blockchain,  # Add the relevant blockchain names, e.g., ["ethereum", "bsc"]
                    "address": wallet_address,
                    "pageToken": page_token,
                    "pageSize": page_size,
                    "descOrder": True
                }
            }

            response = requests.post(env.ankr_url, data=json.dumps(payload), headers=env.ankr_request_header)
            response.raise_for_status()  # Raise an HTTPError for bad responses
            
            # Check the API response JSON for specific data or conditions
            ans = response.json()
            if ans.get('success', True):
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
                    "status": 404  # Example status code for resource not found
                }

            return JsonResponse(data, status=data.get("status"), json_dumps_params={'ensure_ascii': False})

        except requests.exceptions.RequestException as e:
            # Catch any request-related exceptions
            return JsonResponse({'error': str(e)}, status=500)
        except json.JSONDecodeError as e:
            # Catch any JSON decoding errors
            return JsonResponse({'error': 'Failed to parse response'}, status=500)
        except Exception as e:
            # Catch any other exceptions
            return JsonResponse({'error': 'An unexpected error occurred: ' + str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_transaction_by_address(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_calculate_chain_gas_price"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)
        
        response = json.loads(request.body.decode("utf-8"))
        wallet_address = response.get("wallet_address")
        blockchain = response.get("blockchain")
        page_size = response.get("page_size")
        id = response.get("id")
        page_token = response.get("page_token")
        try:
            payload = {
                "id": id,
                "jsonrpc": "2.0",
                "method": "ankr_getTransactionsByAddress",
                
                "params": {
                    "blockchain": blockchain,  # Add the relevant blockchain names, e.g., ["ethereum", "bsc"]
                    "address": wallet_address,
                    "pageToken": page_token,
                    "pageSize": page_size,
                    "descOrder": True
                }
            }
            
            
            response = requests.post(env.ankr_url, data=json.dumps(payload), headers=env.ankr_request_header)
            response.raise_for_status()  # Raise an HTTPError for bad responses
            
            # Check the API response JSON for specific data or conditions
            ans = response.json()
            if ans.get('success', True):
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
                    "status": 404  # Example status code for resource not found
                }

            return JsonResponse(data, status=data.get("status"), json_dumps_params={'ensure_ascii': False})

        except requests.exceptions.RequestException as e:
            # Catch any request-related exceptions
            return JsonResponse({'error': str(e)}, status=500)
        except json.JSONDecodeError as e:
            # Catch any JSON decoding errors
            return JsonResponse({'error': 'Failed to parse response'}, status=500)
        except Exception as e:
            # Catch any other exceptions
            return JsonResponse({'error': 'An unexpected error occurred: ' + str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
def get_nft_transactions_by_owner(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_get_nft_transactions_by_owner"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)
        
        response = json.loads(request.body.decode("utf-8"))
        wallet_address = response.get("wallet_address")
        blockchain = response.get("blockchain")
        page_size = response.get("page_size")
        id = response.get("id")
        page_token = response.get("page_token")
        try:
            payload = {
                "id": id,
                "jsonrpc": "2.0",
                "method": "ankr_getNFTsByOwner",  # Adjust method name for NFTs by owner
                "params": {
                    "blockchain": blockchain,
                    "walletAddress": wallet_address,
                    "pageToken": page_token,
                    "pageSize": page_size,
                    "descOrder": True
                    # Add any additional parameters specific to NFTs by owner
                }
            }
            
            response = requests.post(env.ankr_url, data=json.dumps(payload), headers=env.ankr_request_header)
            response.raise_for_status()  # Raise an HTTPError for bad responses
            
            # Check the API response JSON for specific data or conditions
            ans = response.json()
            if ans.get('success', True):
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
                    "status": 404  # Example status code for resource not found
                }

            return JsonResponse(data, status=data.get("status"), json_dumps_params={'ensure_ascii': False})

        except requests.exceptions.RequestException as e:
            # Catch any request-related exceptions
            return JsonResponse({'error': str(e)}, status=500)
        except json.JSONDecodeError as e:
            # Catch any JSON decoding errors
            return JsonResponse({'error': 'Failed to parse response'}, status=500)
        except Exception as e:
            # Catch any other exceptions
            return JsonResponse({'error': 'An unexpected error occurred: ' + str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    


