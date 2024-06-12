from django.http import JsonResponse
import requests
import json
from osschain import env

def get_account_balance(request):
    if request.method == 'POST':
        response = json.loads(request.body.decode("utf-8"))
        wallet_address = response.get("wallet_address")
        blockchain = response.get("blockchain")
        page_size = response.get("page_size")
        id = response.get("id")
        try:
            payload = {
                "id": id,
                "jsonrpc": "2.0",
                "method": "ankr_getAccountBalance",
                "pageSize": page_size,
                "params": {
                    "blockchain": blockchain,  # Add the relevant blockchain names, e.g., ["ethereum", "bsc"]
                    "walletAddress": wallet_address
                }
            }

            response = requests.post(env.url, data=json.dumps(payload), headers=env.request_header)
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
