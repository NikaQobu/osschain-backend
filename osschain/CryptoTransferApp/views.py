from django.http import JsonResponse
import json
from web3 import Web3

def crypto_transfer(request):
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

            # Dynamically create the infura URL based on the blockchain
            infura_url = f'https://rpc.ankr.com/{blockchain}/f7c0df84b43c7f9f2c529c76efc01da4b30271a66608da4728f9830ea17d29bc'

            # Initialize Web3 with the dynamic infura URL
            web3 = Web3(Web3.HTTPProvider(infura_url))
            
            # Convert the amount to Wei (smallest unit of Ether)
            amount_in_wei = web3.toWei(amount, 'ether')
            
            # Get the nonce (transaction count) for the sender's address
            nonce = web3.eth.getTransactionCount(sender_address)
            
            # Estimate gas for the transaction
            gas_estimate = web3.eth.estimateGas({
                'from': sender_address,
                'to': receiver_address,
                'value': amount_in_wei
            })
            
            # Get the current gas price
            gas_price = web3.eth.gasPrice
            
            # Create the transaction dictionary
            tx = {
                'nonce': nonce,
                'to': receiver_address,
                'value': amount_in_wei,
                'gas': gas_estimate,
                'gasPrice': gas_price,
                'chainId': chain_id  # Mainnet chain ID
            }
            
            # Sign the transaction
            signed_tx = web3.eth.account.sign_transaction(tx, private_key)
            
            # Send the transaction
            tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
            
            # Get the transaction hash
            tx_hash_hex = web3.toHex(tx_hash)
            
            # Return the transaction hash as a JSON response
            return JsonResponse({'success': True, 'tx_hash': tx_hash_hex})
        
        except Exception as e:
            # Return an error response if something goes wrong
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    else:
        # Return an error response if the request method is not POST
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
