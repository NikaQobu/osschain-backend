# WalletListenerApp/views.py

from django.http import JsonResponse, StreamingHttpResponse
import requests
import json
import os
from osschain import env
from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import time




def subscribe_to_wallet(request):
    if request.method == 'POST':
        data = json.loads(request.body)  # Assuming you send wallet_address as POST data
        wallet_address = data.get('wallet_address')
        blockchain = data.get('blockchain')

        if not wallet_address:
            return JsonResponse({'error': 'Wallet address is required'}, status=400)

        webhook_url = 'https://hidden-slice-426318-j1.ey.r.appspot.com/tatum_webhook'  # Replace with your actual webhook URL

        # Adjust chain based on your requirement, e.g., subscribing to all chains
        payload = {
            "type": "ADDRESS_EVENT",
            "attr": {
                "chain": blockchain,  # Adjust based on the chain you want to subscribe to
                "address": wallet_address,
                "url": webhook_url
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
    

def event_stream():
    last_seen = 0
    while True:
        if len(transactions) > last_seen:
            for transaction in transactions[last_seen:]:
                # Filter transactions based on some criteria if needed
                yield f"data: {json.dumps(transaction)}\n\n"
            last_seen = len(transactions)
        time.sleep(1)


def sse_view(request):
    if request.method == 'GET':
        try:
            response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
            response['Cache-Control'] = 'no-cache'
            return response
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only GET method allowed'}, status=405)


def tatum_webhook(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Check subscriptionType
            if 'subscriptionType' in data and data['subscriptionType'] == 'ADDRESS_EVENT':
                tx_hash = data.get('txId')
                amount = data.get('amount')
                sender = data.get('counterAddress')
                recipient = data.get('address')

                # Store transaction data
                transaction = {
                    'tx_hash': tx_hash,
                    'amount': amount,
                    'sender': sender,
                    'recipient': recipient
                }
                transactions.append(transaction)

                # Respond with success message
                return JsonResponse({'message': 'Transaction data received successfully'}, status=200)

            else:
                return JsonResponse({'error': 'Invalid subscriptionType or missing in request'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)