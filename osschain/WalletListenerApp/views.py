# WalletListenerApp/views.py

from django.http import JsonResponse
import requests
import json
from osschain import env
from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import datetime, timedelta



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
                current_time = datetime.utcnow()

                for info in transactions:
                    transaction_time = datetime.fromisoformat(info["time"])

                    if current_time - transaction_time > timedelta(minutes=20):
                        transactions.remove(info)
                        
                    if info['receiver_address'] == wallet_address and info["receiver"] == False:
                        filtered_transactions.append(info)
                        info["receiver"] = True
                            
                    elif info['sender_address'] == wallet_address and info['sender'] == False:
                        info['sender'] = True
                        filtered_transactions.append(info)
                    
                    

                
                transactions = [info for info in transactions if not (info["receiver"] and info["sender"])]

                return JsonResponse(filtered_transactions, safe=False)
            else:
                return JsonResponse({"message": "no transactions found"}, safe=False)
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

            sender_address = transaction_details.get('from', 'N/A')
            receiver_address = transaction_details.get('to', 'N/A')
            
            transaction = {
                "data": data,
                "sender": False,
                "receiver": False,
                "sender_address": sender_address.lower() if sender_address else 'n/a',
                "receiver_address": receiver_address.lower() if receiver_address else 'n/a',
                "time": datetime.utcnow().isoformat()
            }
            
            # if data.get('address').lower() == transaction['receiver_address']:
            #     transaction["receiver"] = True
            # if data.get('address').lower() == transaction['sender_address']:
            #     transaction["sender"] = True
            
            transactions.append(transaction)
            
            return JsonResponse({
                'message': 'Transaction data received successfully',
                'transaction': transaction
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
