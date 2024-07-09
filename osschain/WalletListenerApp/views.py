# WalletListenerApp/views.py

from django.http import JsonResponse
import requests
import json
from osschain import env
from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync




def subscribe_to_wallet(request):
    if request.method == 'POST':
        data = json.loads(request.body)  
        wallet_address = data.get('wallet_address')
        blockchain = data.get('blockchain')

        if not wallet_address:
            return JsonResponse({'error': 'Wallet address is required'}, status=400)
        
        payload = {
            "type": "ADDRESS_EVENT",
            "attr": {
                "chain": blockchain,  
                "address": wallet_address,
                "url": env.tatum_webhook_url
            }
        }

        headers = {
            "x-api-key": env.tatum_api_key,
            "accept": "application/json",
            "content-type": "application/json"
        }

        try:
            response = requests.post(env.tatum_api_subscription_url, json=payload, headers=headers)
            response_data = response.json()

            if response.status_code == 200:
                return JsonResponse({'message': 'Subscribed successfully', 'response': response_data}, status=200)
            else:
                return JsonResponse({'error': f'Failed to subscribe. Tatum API responded with status {response.status_code}: {response_data}'}, status=500)

        except requests.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
transactions = []    
 
def get_last_transactions(request):
    global transactions
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            wallet_address = data.get('wallet_address').lower()
            
            if len(transactions) > 0:
                
                filtered_transactions = []

                for info in transactions:
                    if info['counter_address'] == wallet_address:
                        info["reciver"] = True
                        filtered_transactions.append(info)
                    elif info['address'] == wallet_address:
                        info['sender'] = True
                        filtered_transactions.append(info)

                
                transactions = [info for info in transactions if not (info["reciver"] and info["sender"])]

                return JsonResponse(filtered_transactions, safe=False)
            else:
                return JsonResponse({"message": "no transactions found"}, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def tatum_webhook(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            counter_address = data.get('counterAddress')
            address = data.get('address')

            transaction = {
               "data": data,
               "sender": False,
               "reciver": False,
               "counter_address": counter_address.lower(),
               "address": address.lower()
            }
            
            transactions.append(transaction)

            # Respond with success message
            return JsonResponse({'message': 'Transaction data received successfully'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)