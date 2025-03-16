from django.http import JsonResponse
from .models import DestroyAccounts
import json

def check_destroy_account(request, wallet_address):
    if request.method == 'GET':
        # Check if the wallet_address exists in the DestroyAccounts model
        account = DestroyAccounts.objects.filter(wallet_address=wallet_address).first()  # Use .first() to get the first match or None
        
        if account:
            return JsonResponse({
                "message": "Account found in the destroyed list.",
                "wallet_address": account.wallet_address
            })
        else:
            return JsonResponse({
                "message": "Account not found in the destroyed list."
            }, status=404)  # Return a 404 status for not found
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)
            
def destroy_account(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        wallet_address = data.get('wallet_address')
        
        # Check if the wallet_address already exists
        if DestroyAccounts.objects.filter(wallet_address=wallet_address).exists():
            return JsonResponse({
                "message": "Address already destroyed."
            }, status=400)  # Return a 400 status for bad request
        else:
            # Create a new instance of DestroyAccounts and save it
            new_account = DestroyAccounts(wallet_address=wallet_address)
            new_account.save()
            return JsonResponse({
                "message": "Address successfully added to destroyed accounts.",
                "wallet_address": wallet_address
            }, status=201)  # Return a 201 status for created resource
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)
    
def delete_from_destroy_list(request):
    if request.method == 'DELETE':
        try:
            # Parse the request body to get the wallet_address
            data = json.loads(request.body)
            wallet_address = data.get('wallet_address')

            # Check if the wallet_address exists in the DestroyAccounts model
            account = DestroyAccounts.objects.filter(wallet_address=wallet_address).first()

            if account:
                # If found, delete the account
                account.delete()
                return JsonResponse({
                    "message": "Account successfully removed from the destroyed list.",
                    "wallet_address": wallet_address
                }, status=204)  # 204 No Content indicates success but no additional content to return
            else:
                # Account not found in the destroyed list
                return JsonResponse({
                    "message": "Account not found in the destroyed list."
                }, status=404)  # 404 Not Found status
        except json.JSONDecodeError:
            # Handle JSON parsing error
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)
