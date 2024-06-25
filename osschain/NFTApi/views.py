from django.http import JsonResponse
import requests
import json
from osschain import env
from osschain.client_rescrict import is_rate_limited, get_client_ip

def get_nft_metadata(request):
    if request.method == 'POST':
        try:
            # Parse JSON request body
            response_data = json.loads(request.body.decode('utf-8'))
            blockchain = response_data.get('blockchain')
            token_address = response_data.get('token_address')
            token_id = response_data.get('token_id')

            if not blockchain or not token_address or not token_id:
                return JsonResponse({'success': False, 'error': 'Missing required parameters'}, status=400)

            # Construct the API URL with query parameters
            api_url = 'https://api.tatum.io/v4/data/metadata'
            params = {
                'chain': blockchain,
                'tokenAddress': token_address,
                'tokenIds': token_id
            }


            # Make the API request to Tatum.io
            response = requests.get(api_url, headers=env.api_tatum_header, params=params)
            response.raise_for_status()  # Raise an error for bad status codes

            # Parse and return the response
            data = response.json()
            return JsonResponse({'success': True, 'data': data}, status=200)
        
        except requests.exceptions.HTTPError as http_err:
            # Log the full HTTP error for more detail
            error_msg = f"HTTP error occurred: {http_err}"
            print(error_msg)
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
        except requests.exceptions.RequestException as req_err:
            error_msg = f"Request error occurred: {req_err}"
            print(error_msg)
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
        except json.JSONDecodeError as json_err:
            error_msg = f"JSON decode error: {json_err}"
            print(error_msg)
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
        except Exception as err:
            error_msg = f"An unexpected error occurred: {err}"
            print(error_msg)
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

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
            print(error_msg)
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
        except requests.exceptions.RequestException as req_err:
            error_msg = f"Request error occurred: {req_err}"
            print(error_msg)
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
        except json.JSONDecodeError as json_err:
            error_msg = f"JSON decode error: {json_err}"
            print(error_msg)
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
        except Exception as err:
            error_msg = f"An unexpected error occurred: {err}"
            print(error_msg)
            return JsonResponse({'success': False, 'error': error_msg}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
