# WalletListenerApp/views.py

from django.http import JsonResponse
import requests
import json
from osschain import env
from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone
from datetime import datetime, timedelta
from .models import PushInfo, Transactions
from django.shortcuts import render
from django.db.models import Q
from django.db import transaction as db_transaction



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
    
   
 
def get_last_transactions(request):
    if request.method == 'POST':
        try:
            # Load and process JSON data from the request body
            data = json.loads(request.body)
            wallet_address = data.get('wallet_address', '').lower()

            # Retrieve all transactions from the database
            transactions = Transactions.objects.filter(
                Q(receiver_address=wallet_address) | Q(sender_address=wallet_address)
            )

            # Collect updates and deletions
            update_list = []
            delete_list = []

            for transaction in transactions:
                if transaction.receiver_address == wallet_address and not transaction.receiver:
                    transaction.receiver = True
                    update_list.append(transaction)
                
                elif transaction.sender_address == wallet_address and not transaction.sender:
                    transaction.sender = True
                    update_list.append(transaction)
                
                elif transaction.receiver and transaction.sender:
                    delete_list.append(transaction)

            # Perform bulk update
            if update_list:
                with db_transaction.atomic():
                    for tx in update_list:
                        tx.save()

            # Perform bulk delete
            if delete_list:
                with db_transaction.atomic():
                    Transactions.objects.filter(id__in=[tx.id for tx in delete_list]).delete()

            # Serialize the transactions for response
            transactions_data = list(transactions.values())

            return JsonResponse(transactions_data, safe=False)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def normalize_chain(chain):
    # Normalize the chain value to match the Tatum API requirements
    chain_map = {
        'polygon-mainnet': 'polygon',
        'ethereum-mainnet': 'ethereum',
        'bsc-mainnet': 'bsc',
        'bitcoin-mainnet': 'bitcoin',
        'litecoin-mainnet': 'litecoin',
        'doge-mainnet': 'dogecoin',
        'bcash-mainnet': 'bitcoin-cash',
        'tron-mainnet': 'tron',
        'stellar-mainnet': 'stellar',
        'xrp-mainnet': 'xrp',
        'algorand-mainnet-algod': 'algorand-algod',
        'algorand-mainnet-indexer': 'algorand-indexer',
        'arb-nova-mainnet': 'arbitrum-nova',
        'arbitrum-one-mainnet': 'arbitrum-one',
        'aurora-mainnet': 'aurora',
        'avalanche-c-mainnet': 'avalanche-c',
        'avax-p-mainnet': 'avalanche-p',
        'avax-x-mainnet': 'avalanche-x',
        'base-mainnet': 'base',
        'bnb-beacon-chain-mainnet': 'bnb',
        'cardano-mainnet': 'cardano-rosetta',
        'cosmos-mainnet': 'cosmos-rosetta',
        'celo-mainnet': 'celo',
        'cronos-mainnet': 'cronos',
        'eos-mainnet': 'eos',
        'eon-mainnet': 'horizen-eon',
        'chiliz-mainnet': 'chiliz',
        'ethereum-classic-mainnet': 'ethereum-classic',
        'fantom-mainnet': 'fantom',
        'flare-mainnet': 'flare',
        'flow-mainnet': 'flow',
        'gno-mainnet': 'gnosis',
        'haqq-mainnet': 'haqq',
        'one-mainnet-s0': 'harmony-one-shard-0',
        'iota-mainnet': 'iota',
        'kadena-mainnet': 'kadena',
        'klaytn-mainnet': 'klaytn',
        'kcs-mainnet': 'kucoin',
        'egld-mainnet': 'multiversx',
        'near-mainnet': 'near',
        'oasis-mainnet': 'oasis',
        'optimism-mainnet': 'optimism',
        'palm-mainnet': 'palm',
        'dot-mainnet': 'polkadot',
        'bch-mainnet-rostrum': 'rostrum',
        'rsk-mainnet': 'rsk',
        'solana-mainnet': 'solana',
        'tezos-mainnet': 'tezos',
        'vechain-mainnet': 'vechain',
        'xinfin-mainnet': 'xinfin',
        'zcash-mainnet': 'zcash',
        'zilliqa-mainnet': 'zilliqa',
        'bitcoin-mainnet-electrs': 'bitcoin-electrs',
        'casper-mainnet': 'casper',
        'algorand-testnet-algod': 'algorand-algod-testnet',
        'algorand-testnet-indexer': 'algorand-indexer-testnet',
        'arb-testnet': 'arbitrum-nova-testnet',
        'aurora-testnet': 'aurora-testnet',
        'avax-testnet': 'avalanche-c-testnet',
        'avax-p-testnet': 'avalanche-p-testnet',
        'avax-x-testnet': 'avalanche-x-testnet',
        'base-sepolia': 'base-sepolia',
        'bsc-testnet': 'binance-smart-chain-testnet',
        'bitcoin-testnet': 'bitcoin-testnet',
        'bch-testnet': 'bitcoin-cash-testnet',
        'cardano-preprod': 'cardano-rosetta-preprod',
        'celo-testnet': 'celo-alfajores',
        'cro-testnet': 'cronos-testnet',
        'doge-testnet': 'dogecoin-testnet',
        'ethereum-sepolia': 'ethereum-sepolia',
        'ethereum-holesky': 'ethereum-holesky',
        'eos-testnet': 'eos-testnet',
        'fantom-testnet': 'fantom-testnet',
        'flare-coston': 'flare-coston',
        'flare-coston2': 'flare-coston-2',
        'flare-songbird': 'flare-songbird',
        'flow-testnet': 'flow-testnet',
        'gno-testnet': 'gnosis-testnet',
        'haqq-testnet': 'haqq-testnet',
        'one-testnet-s0': 'harmony-one-testnet-shard-0',
        'horizen-eon-gobi': 'horizen-eon-gobi',
        'kadena-testnet': 'kadena-testnet',
        'klaytn-baobab': 'klaytn-baobab',
        'kcs-testnet': 'kucoin-testnet',
        'litecoin-testnet': 'litecoin-testnet',
        'egld-testnet': 'multiversx-testnet',
        'near-testnet': 'near-testnet',
        'oasis-testnet': 'oasis-testnet',
        'optimism-testnet': 'optimism-testnet',
        'palm-testnet': 'palm-testnet',
        'polygon-amoy': 'polygon-testnet',
        'dot-testnet': 'polkadot-testnet',
        'rsk-testnet': 'rsk-testnet',
        'solana-devnet': 'solana-devnet',
        'stellar-testnet': 'stellar-testnet',
        'tezos-testnet': 'tezos-testnet',
        'tron-testnet': 'tron-testnet',
        'vechain-testnet': 'vechain-testnet',
        'xdc-testnet': 'xinfin-testnet',
        'ripple-testnet': 'xrp-testnet',
        'zcash-testnet': 'zcash-testnet',
        'zilliqa-testnet': 'zilliqa-testnet',
        'iota-testnet': 'iota-testnet',
        'bitcoin-testnet-electrs': 'bitcoin-electrs-testnet',
        'bch-testnet-rostrum': 'rostrum-testnet',
        # Add other testnet mappings if needed
    }
    return chain_map.get(chain, chain)

def is_valid_tx_id(tx_id):
    return isinstance(tx_id, str) and tx_id.startswith('0x') and len(tx_id) == 66

def decode_erc20_transfer_input(input_data):
    # ERC20 transfer method ID is "0xa9059cbb"
    if input_data.startswith('0xa9059cbb'):
        recipient_address = '0x' + input_data[34:74]
        return recipient_address.lower()
    return None

def get_transaction_details(tx_id, blockchain='polygon'):
    if not is_valid_tx_id(tx_id):
        print("Invalid transaction ID format.")
        return None

    TATUM_API_URL = f"https://api.tatum.io/v3/{blockchain}/transaction/{tx_id}"
    headers = {
        'x-api-key': env.tatum_api_key  # Replace with your actual Tatum API key
    }
    
    response = requests.get(TATUM_API_URL, headers=headers)
    
    if response.status_code == 200:
        transaction_details = response.json()

        # Check if it's a token transfer
        input_data = transaction_details.get('input')
        if input_data:
            receiver_address = decode_erc20_transfer_input(input_data)
            if receiver_address:
                return {
                    "from": transaction_details.get('from', ''),
                    "to": receiver_address
                }
        
        # Handle regular transfer
        sender_address = transaction_details.get('from')
        receiver_address = transaction_details.get('to')
        return {
            "from": sender_address if sender_address else 'N/A',
            "to": receiver_address if receiver_address else 'N/A'
        }
    elif response.status_code == 403:
        print("Transaction not found. It might not exist or is still pending.")
        return None
    else:
        print(f"Error: {response.status_code} - {response.content}")
        return None


def send_push_notification(wallet_address, new_transaction):
    
    #all_push_infos = PushInfo.objects.all()
    # for push_info in all_push_infos:
    #     print(f'Wallet Address: {push_info.wallet_address}, Push Token: {push_info.push_token}')
    try:
        # Print data for the specific wallet address
        push_info = PushInfo.objects.get(wallet_address=wallet_address)
        
        
        
        # Fetch the push token
        push_token = push_info.push_token
        
      
        title = ""
        body = ""
        
        
        type_token = new_transaction.data["type"]
        if new_transaction.receiver_address:
            title = "Transaction recieved"
            body = f"Recived: {type_token}"
        elif new_transaction.sender_address:
            title = "Transaction sent"
            body = f"Sent: {type_token}"
        
        
        
        # Expo push notification endpoint
        url = 'https://exp.host/--/api/v2/push/send'
        
        # Payload for the push notification
        payload = {
            'to': push_token,
            'title': title,
            'body': body,
        }
    
        
        # Headers for the push notification request
        headers = {
            "host": "exp.host",
            "accept": "application/json",
            "accept-encoding": "gzip, deflate",
            "content-type": "application/json",
        }
        
        
        # Send the push notification
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            return JsonResponse({'message': 'Push notification sent successfully.'})
        else:
            return JsonResponse({'message': f'Failed to send push notification: {response.status_code} - {response.text}'}, status=response.status_code)
    
    except PushInfo.DoesNotExist:
        return JsonResponse({'message': 'Wallet address not found in the database.'}, status=404)
 
    
def tatum_webhook(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tx_id = data.get('txId')
            blockchain = data.get('chain')
            
            # Normalize the chain value and fetch transaction details
            normalized_chain = normalize_chain(blockchain)
            transaction_details = get_transaction_details(tx_id, blockchain=normalized_chain)
            
            if transaction_details is None:
                return JsonResponse({'error': 'Failed to fetch transaction details'}, status=500)

            sender_address = transaction_details.get('from', 'N/A').lower()
            receiver_address = transaction_details.get('to', 'N/A').lower()
            
            new_transaction = Transactions.objects.create(
                data=data,
                sender=False,
                receiver=False,
                sender_address=sender_address if sender_address else 'n/a',
                receiver_address=receiver_address if receiver_address else 'n/a',
            )
            
            
            send_push_notification(sender_address, new_transaction)
            send_push_notification(receiver_address, new_transaction)
            
            return JsonResponse({
                'message': 'Transaction data received successfully',
            }, status=200)
            
            
            

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

def save_push_info(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            wallet_address = data.get('wallet_address').lower()
            push_token = data.get('push_token')

            # Validate the data
            if not wallet_address or not push_token:
                return JsonResponse({'error': 'Wallet address and push token are required.'}, status=400)

            try:
                # Check if a PushInfo entry with the wallet_address already exists
                PushInfo.objects.get(wallet_address=wallet_address)
                return JsonResponse({'message': 'This info already exists.'}, status=409)  # 409 Conflict

            except PushInfo.DoesNotExist:
                # Create a new PushInfo entry
                push_info = PushInfo.objects.create(wallet_address=wallet_address, push_token=push_token)
                push_info.save()
                return JsonResponse({'message': 'Push info saved successfully.'}, status=201)  # 201 Created

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    