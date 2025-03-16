from django.http import JsonResponse
import requests
import json
from osschain import env
from osschain.client_rescrict import is_rate_limited, get_client_ip

def get_nft_metadata(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_calculate_chain_gas_price"
        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)
        
        response = json.loads(request.body.decode("utf-8"))
        id = response.get("id")
        contract_address = response.get("contract_address")
        blockchain = response.get("blockchain")
        page_size = response.get("page_size")
        token_id = response.get("token_id")
        
        
        try:
            payload = {
                "id": id,
                "jsonrpc": "2.0",
                "method": "ankr_getNFTMetadata",
                
                "params": {
                    "blockchain": blockchain,  # Add the relevant blockchain names, e.g., ["ethereum", "bsc"]
                    "contractAddress": contract_address,
                    "tokenId": token_id
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

def get_nft_by_owner(request):
    if request.method == 'POST':
        try:
            response_data = json.loads(request.body.decode('utf-8'))
            wallet_address = response_data.get('wallet_address')
            blockchain = response_data.get('blockchain')

            if not wallet_address or not blockchain:
                return JsonResponse({'success': False, 'error': 'Missing required parameters'}, status=400)

            api_url = f'https://api.tatum.io/v4/data/metadata'  # Use the appropriate endpoint
            params = {
                'chain': blockchain,
                'tokenAddress': wallet_address,  # Ensure you use the correct parameter names
                'tokenIds': '1'  # Use the correct token IDs if applicable
            }

            

            response = requests.get(api_url, headers=env.api_tatum_header, params=params)
            response.raise_for_status()

            data = response.json()
            return JsonResponse({'success': True, 'data': data}, status=200)

        except requests.exceptions.HTTPError as http_err:
            error_msg = f"HTTP error occurred: {http_err}"
           
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
        except requests.exceptions.RequestException as req_err:
            error_msg = f"Request error occurred: {req_err}"
       
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
        except json.JSONDecodeError as json_err:
            error_msg = f"JSON decode error: {json_err}"
         
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
        except Exception as err:
            error_msg = f"An unexpected error occurred: {err}"
           
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
    
    
def get_nft_transfers(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_get_nft_transfers"
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
                "method": "ankr_getNftTransfers",
                "params": {
                    "blockchain": blockchain,  # Add the relevant blockchain names, e.g., ["ethereum", "bsc"]
                    "address": wallet_address,
                    "pageToken": page_token,
                    "pageSize": page_size,
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
