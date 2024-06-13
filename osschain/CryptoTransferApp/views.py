from django.http import JsonResponse
import json
from web3 import Web3
import time

def fetch_native_currency(blockchain):
    known_blockchains = {
        'ethereum': 'ETH',
        'polygon': 'MATIC',
        'bsc': 'BNB',
        'avalanche': 'AVAX',
        'optimism': 'OP',
        # Add more known blockchains and their native currencies here
    }
    return known_blockchains.get(blockchain.lower(), 'UNKNOWN')


def calculate_chain_gas_price(request):
    if request.method == 'POST':
        try:
            # Parse the JSON request body
            data = json.loads(request.body.decode('utf-8'))
            sender_address = data.get('sender_address')
            receiver_address = data.get('receiver_address')
            amount = data.get('amount')
            blockchain = data.get('blockchain')

            # Validate input
            if not all([sender_address, receiver_address, amount, blockchain]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Dynamically create the RPC URL
            rpc_url = f'https://rpc.ankr.com/{blockchain}/f7c0df84b43c7f9f2c529c76efc01da4b30271a66608da4728f9830ea17d29bc'
            web3 = Web3(Web3.HTTPProvider(rpc_url))

            # Check if the connection is established
            if not web3.is_connected():
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)

            # Convert the amount to Wei
            amount_in_wei = web3.to_wei(amount, 'ether')

            # Ensure we call estimate_gas with the correct arguments
            transaction = {
                'from': sender_address,
                'to': receiver_address,
                'value': amount_in_wei
            }
            
            
            gas_estimate = web3.eth.estimate_gas(transaction)
                
                

            # Estimate gas for the transaction
            
            
            

            # Get the current gas price
            gas_price = web3.eth.gas_price

            # Calculate gas fee in Wei
            gas_fee_wei = gas_estimate * gas_price

            # Convert gas fee to the native currency
            gas_fee_native = web3.from_wei(gas_fee_wei, 'ether')

            # Fetch the native currency symbol
            native_currency = fetch_native_currency(blockchain)

            # Return the gas fee in Wei and the native currency
            return JsonResponse({
                'success': True,
                'gas_fee_wei': gas_fee_wei,
                'gas_fee_native': float(gas_fee_native),
                'native_currency': native_currency
            })

        except Exception as e:
            # Log error for debugging
            print(f"Error: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        # Return an error response if the request method is not POST
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

def crypto_chain_transfer(request):
    if request.method == 'POST':
        try:
            # Parse the JSON request body
            data = json.loads(request.body.decode('utf-8'))
            sender_address = data.get('sender_address')
            private_key = data.get('private_key')
            receiver_address = data.get('receiver_address')
            amount = data.get('amount')
            chain_id = data.get('chain_id')
            blockchain = data.get('blockchain')
            calculated_gas_fee = data.get('calculated_gas_fee')

            # Dynamically create the URL based on the blockchain
            rpc_url = f'https://rpc.ankr.com/{blockchain}/f7c0df84b43c7f9f2c529c76efc01da4b30271a66608da4728f9830ea17d29bc'

            # Initialize Web3 with the dynamic URL
            web3 = Web3(Web3.HTTPProvider(rpc_url))
            
            # Check if the provider is set (connection is established)
            if web3.is_connected():
                # Convert the amount to Wei (smallest unit of Ether)
                amount_in_wei = web3.to_wei(amount, 'ether')
                
                # Get the nonce (transaction count) for the sender's address
                nonce = web3.eth.get_transaction_count(sender_address)
                
                # Estimate gas for the transaction
                gas_estimate = web3.eth.estimate_gas({
                    'from': sender_address,
                    'to': receiver_address,
                    'value': amount_in_wei
                })
                
                # Get the current gas price
                gas_price = web3.eth.gas_price
                
                
                gas_fee_wei = gas_estimate * gas_price
                
                if gas_fee_wei == calculated_gas_fee:
                    # Create the transaction dictionary
                    tx = {
                        'nonce': nonce,
                        'to': receiver_address,
                        'value': amount_in_wei,
                        'gas': gas_estimate,
                        'gasPrice': gas_price,
                        'chainId': int(chain_id)
                    }
                    
                    # Sign the transaction
                    signed_tx = web3.eth.account.sign_transaction(tx, private_key)
                    
                    # Send the transaction
                    tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
                    
                    # Get the transaction hash
                    tx_hash_hex = web3.to_hex(tx_hash)
                    
                    # Return the transaction hash as a JSON response
                    return JsonResponse({'success': True, 'tx_hash': tx_hash_hex})
                else:
                    return JsonResponse({'success': False, 'message': "gas fees does not mathes"})
            else:
                # Return an error response if the connection is not established
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)
        
        except Exception as e:
            # Return an error response if something goes wrong
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    else:
        # Return an error response if the request method is not POST
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
    
    
