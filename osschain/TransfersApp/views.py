from django.http import JsonResponse
import json
from web3 import Web3
from django.core.cache import cache
import time
import logging
from osschain.client_rescrict import is_rate_limited, get_client_ip
from osschain import env
from web3.middleware import geth_poa_middleware


def retry_on_specific_error(func, retries=5, delay=1, specific_error_message=None):
    if specific_error_message is None:
        specific_error_message = "{'code': -32602, 'message': 'too many arguments, want at most 1'}"
    
    for attempt in range(retries):
        try:
            return func()
        except Exception as e:
            error_message = str(e)
            if specific_error_message in error_message:
                logging.warning(f"Error occurred: {error_message}. Retrying {attempt + 1}/{retries}")
                time.sleep(delay)
            else:
                raise e
    raise Exception(f"Exceeded maximum retries with error: {error_message}")

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
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_calculate_chain_gas_price"

        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)

        try:
            data = json.loads(request.body.decode('utf-8'))
            sender_address = data.get('sender_address')
            receiver_address = data.get('receiver_address')
            amount = data.get('amount')
            blockchain = data.get('blockchain')

            if not all([sender_address, receiver_address, amount, blockchain]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Convert addresses to checksum format
            sender_address = Web3.to_checksum_address(sender_address)
            receiver_address = Web3.to_checksum_address(receiver_address)

            # Connect to the blockchain
            rpc_url = env.get_blockchain_rpc_node(blockchain)
            web3 = Web3(Web3.HTTPProvider(rpc_url))

            if not web3.is_connected():
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)

            def build_and_estimate_gas():
                amount_in_wei = web3.to_wei(amount, 'ether')
                transaction = {
                    'from': sender_address,
                    'to': receiver_address,
                    'value': amount_in_wei,
                    'gas': 21000,  # Use a standard gas limit for basic ETH transfer
                    'gasPrice': web3.eth.gas_price
                }
                gas_estimate = web3.eth.estimate_gas(transaction)
                gas_price = web3.eth.gas_price
                gas_fee_wei = gas_estimate * gas_price
                gas_fee_native = web3.from_wei(gas_fee_wei, 'ether')
                native_currency = fetch_native_currency(blockchain)

                return {
                    'gas_fee_wei': gas_fee_wei,
                    'gas_fee_native': float(gas_fee_native),
                    'native_currency': native_currency
                }

            result = retry_on_specific_error(build_and_estimate_gas)

            # Allow a 5% tolerance in gas fee
            calculated_gas_fee = result['gas_fee_wei']
            tolerance = 0.05
            min_acceptable_fee = calculated_gas_fee * (1 - tolerance)
            max_acceptable_fee = calculated_gas_fee * (1 + tolerance)

            if min_acceptable_fee <= result['gas_fee_wei'] <= max_acceptable_fee:
                return JsonResponse({'success': True, **result})
            else:
                raise Exception(f"Gas fee out of acceptable range. Required: {calculated_gas_fee}, Actual: {result['gas_fee_wei']}")

        except Exception as e:
            logging.error(f"Error in calculate_chain_gas_price: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
    
def calculate_token_gas_price(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_calculate_token_gas_price"

        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)

        try:
            data = json.loads(request.body.decode('utf-8'))
            sender_address = data.get('sender_address')
            receiver_address = data.get('receiver_address')
            amount = data.get('amount')
            blockchain = data.get('blockchain')
            token_contract_address = data.get('token_contract_address')

            if not all([sender_address, receiver_address, amount, blockchain, token_contract_address]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Convert addresses to checksum format
            sender_address = Web3.to_checksum_address(sender_address)
            receiver_address = Web3.to_checksum_address(receiver_address)
            token_contract_address = Web3.to_checksum_address(token_contract_address)

            # Connect to the blockchain
            rpc_url = env.get_blockchain_rpc_node(blockchain)
            web3 = Web3(Web3.HTTPProvider(rpc_url))

            if not web3.is_connected():
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)

            def build_and_estimate_gas():
                token_contract = web3.eth.contract(address=token_contract_address, abi=env.ERC20_ABI)
                
                # Fetch token decimals and convert the amount
                decimals = token_contract.functions.decimals().call()
                logging.info(f"Token decimals: {decimals}")
                amount_in_smallest_unit = int(amount * (10 ** decimals))
                logging.info(f"Amount in smallest unit: {amount_in_smallest_unit}")

                tx_data = token_contract.functions.transfer(
                    receiver_address,
                    amount_in_smallest_unit
                ).build_transaction({
                    'from': sender_address,
                    'gas': 0,  # Initial value for gas estimation
                    'gasPrice': 0,  # Initial value for gas estimation
                })

                # Estimate gas and calculate fees
                gas_estimate = web3.eth.estimate_gas(tx_data)
                gas_price = web3.eth.gas_price
                gas_fee_wei = gas_estimate * gas_price
                gas_fee_native = web3.from_wei(gas_fee_wei, 'ether')
                native_currency = fetch_native_currency(blockchain)

                logging.info(f"Gas estimate: {gas_estimate}, Gas price: {gas_price}")
                logging.info(f"Gas fee (wei): {gas_fee_wei}, Gas fee (native): {gas_fee_native}")

                return {
                    'gas_fee_wei': gas_fee_wei,
                    'gas_fee_native': float(gas_fee_native),
                    'native_currency': native_currency
                }

            result = retry_on_specific_error(build_and_estimate_gas)
            return JsonResponse({'success': True, **result})

        except Exception as e:
            logging.error(f"Error in calculate_token_gas_price: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

def calculate_nft_fee(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_calculate_nft_fee"

        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)

        try:
            data = json.loads(request.body.decode('utf-8'))
            sender_address = data.get('sender_address')
            receiver_address = data.get('receiver_address')
            nft_token_id = data.get('nft_token_id')
            blockchain = data.get('blockchain')
            nft_contract_address = data.get('nft_contract_address')
            token_standard = data.get('token_standard')

            if not all([sender_address, receiver_address, nft_token_id, blockchain, nft_contract_address]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Convert addresses to checksum format
            sender_address = Web3.to_checksum_address(sender_address)
            receiver_address = Web3.to_checksum_address(receiver_address)
            nft_contract_address = Web3.to_checksum_address(nft_contract_address)

            # Convert nft_token_id to integer
            try:
                nft_token_id = int(nft_token_id)
            except ValueError:
                return JsonResponse({'success': False, 'error': 'Invalid NFT token ID'}, status=400)

            # Connect to the blockchain
            rpc_url = env.get_blockchain_rpc_node(blockchain)  # Replace with your actual RPC URL
            web3 = Web3(Web3.HTTPProvider(rpc_url))

            # Add the POA middleware for compatibility with networks like Polygon
            web3.middleware_onion.inject(geth_poa_middleware, layer=0)

            if not web3.is_connected():
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)
            
            if token_standard == "ERC721":
                abi = env.ERC721_ABI
                transfer_function = 'transferFrom'
            elif token_standard == "ERC1155":
                abi = env.ERC1155_ABI
                transfer_function = 'safeTransferFrom'
            else:
                return JsonResponse({'success': False, 'error': 'Unsupported token standard'}, status=400)

            if abi:
                nft_contract = web3.eth.contract(address=nft_contract_address, abi=abi)
            else:
                return JsonResponse({'success': False, 'error': 'ABI not found'}, status=400)

            def build_and_estimate_gas():
                try:
                    if token_standard == "ERC721":
                        tx_data = nft_contract.functions.transferFrom(
                            sender_address, receiver_address, nft_token_id
                        ).build_transaction({
                            'from': sender_address
                        })['data']
                    elif token_standard == "ERC1155":
                        tx_data = nft_contract.functions.safeTransferFrom(
                            sender_address, receiver_address, nft_token_id, 1, b''
                        ).build_transaction({
                            'from': sender_address
                        })['data']

                    # Estimate gas
                    gas_estimate = web3.eth.estimate_gas({
                        'from': sender_address,
                        'to': nft_contract_address,
                        'data': tx_data
                    })
                    logging.info(f"Gas Estimate: {gas_estimate}")

                    # Get current gas price
                    gas_price = web3.eth.gas_price
                    logging.info(f"Gas Price: {gas_price}")

                    # Calculate the total fee
                    total_fee = gas_estimate * gas_price
                    total_fee_native = web3.from_wei(total_fee, 'ether')

                    logging.info(f"Total Fee (in Wei): {total_fee}")
                    logging.info(f"Total Fee (in Native Currency): {total_fee_native}")

                    native_currency = fetch_native_currency(blockchain)

                    return {
                        'gas_estimate': gas_estimate,
                        'gas_price': gas_price,
                        'total_fee_wei': total_fee,
                        'total_fee_native': float(total_fee_native),
                        'native_currency': native_currency
                    }
                except Exception as e:
                    logging.error(f"Gas estimation failed: {str(e)}")
                    raise Exception(f"Gas estimation failed: {str(e)}")

            result = build_and_estimate_gas()
            return JsonResponse({'success': True, **result})

        except Exception as e:
            logging.error(f"Error in calculate_nft_fee: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

def nft_transfer(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_nft_transfer"

        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)

        try:
            data = json.loads(request.body.decode('utf-8'))
            sender_address = data.get('sender_address')
            private_key = data.get('private_key')
            receiver_address = data.get('receiver_address')
            nft_token_id = data.get('nft_token_id')
            blockchain = data.get('blockchain')
            nft_contract_address = data.get('nft_contract_address')
            token_standard = data.get("token_standard")
            calculated_gas_fee = data.get('calculated_gas_fee')

            logging.debug(f"Received data: {data}")

            if not all([sender_address, private_key, receiver_address, nft_token_id, blockchain, nft_contract_address, token_standard, calculated_gas_fee]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Validate addresses
            if sender_address.lower() == '0x0000000000000000000000000000000000000000' or receiver_address.lower() == '0x0000000000000000000000000000000000000000':
                return JsonResponse({'success': False, 'error': 'Invalid sender or receiver address'}, status=400)

            sender_address = Web3.to_checksum_address(sender_address)
            receiver_address = Web3.to_checksum_address(receiver_address)
            nft_contract_address = Web3.to_checksum_address(nft_contract_address)

            # Convert nft_token_id and calculated_gas_fee to integer
            try:
                nft_token_id = int(nft_token_id)
                calculated_gas_fee = int(calculated_gas_fee)
            except ValueError as e:
                logging.error(f"Error converting to int: {e}")
                return JsonResponse({'success': False, 'error': 'Invalid NFT token ID or calculated gas fee'}, status=400)

            rpc_url = env.get_blockchain_rpc_node(blockchain)  # Replace with your actual RPC URL
            web3 = Web3(Web3.HTTPProvider(rpc_url))

            # Add the POA middleware for compatibility with networks like Polygon
            web3.middleware_onion.inject(geth_poa_middleware, layer=0)

            if web3.is_connected():
                nonce = web3.eth.get_transaction_count(sender_address)
                logging.debug(f"Nonce for transaction: {nonce}")

                # Ensure the sender has enough balance
                balance = web3.eth.get_balance(sender_address)
                logging.debug(f"Sender balance: {web3.from_wei(balance, 'ether')} {fetch_native_currency(blockchain)}")

                if balance < calculated_gas_fee:
                    return JsonResponse({'success': False, 'error': 'Insufficient funds for transfer'}, status=400)

                if token_standard == "ERC721":
                    abi = env.ERC721_ABI
                    transfer_function = 'transferFrom'
                elif token_standard == "ERC1155":
                    abi = env.ERC1155_ABI
                    transfer_function = 'safeTransferFrom'
                else:
                    return JsonResponse({'success': False, 'error': 'Unsupported token standard'}, status=400)

                nft_contract = web3.eth.contract(address=nft_contract_address, abi=abi)

                def build_and_send_transaction():
                    try:
                        if token_standard == "ERC721":
                            tx = nft_contract.functions.transferFrom(
                                sender_address,
                                receiver_address,
                                nft_token_id
                            ).build_transaction({
                                'gas': 200000,  # Provide a reasonable gas limit
                                'gasPrice': web3.eth.gas_price,
                                'nonce': nonce,
                                'from': sender_address
                            })
                        elif token_standard == "ERC1155":
                            tx = nft_contract.functions.safeTransferFrom(
                                sender_address,
                                receiver_address,
                                nft_token_id,
                                1,  # Amount of tokens to transfer
                                b''  # Additional data (optional)
                            ).build_transaction({
                                'gas': 200000,  # Provide a reasonable gas limit
                                'gasPrice': web3.eth.gas_price,
                                'nonce': nonce,
                                'from': sender_address
                            })

                        # Estimate gas
                        gas_estimate = web3.eth.estimate_gas(tx)
                        gas_price = web3.eth.gas_price
                        gas_fee_wei = gas_estimate * gas_price

                        # Allow a 5% tolerance in gas fee
                        tolerance = 0.05
                        min_acceptable_fee = int(calculated_gas_fee * (1 - tolerance))
                        max_acceptable_fee = int(calculated_gas_fee * (1 + tolerance))

                        if min_acceptable_fee <= gas_fee_wei <= max_acceptable_fee:
                            # Sign the transaction
                            signed_tx = web3.eth.account.sign_transaction(tx, private_key)
                            tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
                            return web3.to_hex(tx_hash)
                        else:
                            raise Exception(f"Gas fee out of acceptable range. Required: {calculated_gas_fee}, Actual: {gas_fee_wei}")

                    except Exception as e:
                        logging.error(f"Gas estimation or transaction signing failed: {str(e)}")
                        raise Exception(f"Gas estimation or transaction signing failed: {str(e)}")

                # Retry on error
                tx_hash_hex = retry_on_specific_error(build_and_send_transaction)
                
                return JsonResponse({'success': True, 'tx_hash': tx_hash_hex})
            else:
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)

        except Exception as e:
            logging.error(f"Error in nft_transfer: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

def crypto_chain_transfer(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_calculate_chain_gas_price"

        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)

        try:
            data = json.loads(request.body.decode('utf-8'))
            sender_address = data.get('sender_address')
            private_key = data.get('private_key')
            receiver_address = data.get('receiver_address')
            amount = data.get('amount')
            chain_id = data.get('chain_id')
            blockchain = data.get('blockchain')
            calculated_gas_fee = data.get('calculated_gas_fee')

            if not all([sender_address, private_key, receiver_address, amount, chain_id, blockchain, calculated_gas_fee]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Ensure addresses are valid and not zero address
            if sender_address.lower() == '0x0000000000000000000000000000000000000000' or receiver_address.lower() == '0x0000000000000000000000000000000000000000':
                return JsonResponse({'success': False, 'error': 'Invalid sender or receiver address'}, status=400)

            # Convert to checksum addresses
            sender_address = Web3.to_checksum_address(sender_address)
            receiver_address = Web3.to_checksum_address(receiver_address)

            rpc_url = env.get_blockchain_rpc_node(blockchain)
            web3 = Web3(Web3.HTTPProvider(rpc_url))

            if web3.is_connected():
                def build_and_send_transaction():
                    # Convert amount to wei
                    amount_in_wei = web3.to_wei(amount, 'ether')
                    # Get the nonce
                    nonce = web3.eth.get_transaction_count(sender_address)
                    
                    # Build transaction
                    transaction = {
                        'nonce': nonce,
                        'to': receiver_address,
                        'value': amount_in_wei,
                        'gas': 21000,  # Standard gas limit for ETH transfer
                        'gasPrice': web3.eth.gas_price,
                        'chainId': int(chain_id)
                    }

                    # Estimate gas and calculate fees
                    gas_estimate = web3.eth.estimate_gas(transaction)
                    gas_fee_wei = gas_estimate * web3.eth.gas_price

                    # Allow a 5% tolerance in gas fee
                    tolerance = 0.05
                    min_acceptable_fee = calculated_gas_fee * (1 - tolerance)
                    max_acceptable_fee = calculated_gas_fee * (1 + tolerance)

                    if min_acceptable_fee <= gas_fee_wei <= max_acceptable_fee:
                        signed_tx = web3.eth.account.sign_transaction(transaction, private_key)
                        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
                        return web3.to_hex(tx_hash)
                    else:
                        raise Exception(f"Gas fee out of acceptable range. Required: {calculated_gas_fee}, Actual: {gas_fee_wei}")

                tx_hash_hex = retry_on_specific_error(build_and_send_transaction)
                return JsonResponse({'success': True, 'tx_hash': tx_hash_hex})
            else:
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)

        except Exception as e:
            logging.error(f"Error in crypto_chain_transfer: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

def crypto_token_transfer(request):
    if request.method == 'POST':
        user_ip = get_client_ip(request)
        user_key = f"rate_limit_{user_ip}_crypto_token_transfer"

        if is_rate_limited(user_key):
            return JsonResponse({'success': False, 'error': 'Rate limit exceeded. Try again later.'}, status=429)
        
        try:
            data = json.loads(request.body.decode('utf-8'))
            sender_address = data.get('sender_address')
            private_key = data.get('private_key')
            receiver_address = data.get('receiver_address')
            amount = data.get('amount')
            chain_id = data.get('chain_id')
            blockchain = data.get('blockchain')
            token_contract_address = data.get('token_contract_address')
            calculated_gas_fee = data.get('calculated_gas_fee')

            if not all([sender_address, private_key, receiver_address, amount, chain_id, blockchain, token_contract_address]):
                return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

            # Validate addresses
            if sender_address.lower() == '0x0000000000000000000000000000000000000000' or receiver_address.lower() == '0x0000000000000000000000000000000000000000':
                return JsonResponse({'success': False, 'error': 'Invalid sender or receiver address'}, status=400)

            sender_address = Web3.to_checksum_address(sender_address)
            receiver_address = Web3.to_checksum_address(receiver_address)
            token_contract_address = Web3.to_checksum_address(token_contract_address)

            rpc_url = env.get_blockchain_rpc_node(blockchain)
            web3 = Web3(Web3.HTTPProvider(rpc_url))

            if web3.is_connected():
                nonce = web3.eth.get_transaction_count(sender_address)
                token_contract = web3.eth.contract(address=token_contract_address, abi=env.ERC20_ABI)

                def build_and_send_transaction():
                    # Fetch token decimals and convert amount
                    decimals = token_contract.functions.decimals().call()
                    amount_in_smallest_unit = int(amount * (10 ** decimals))

                    tx = token_contract.functions.transfer(
                        receiver_address,
                        amount_in_smallest_unit
                    ).build_transaction({
                        'chainId': int(chain_id),
                        'gas': 200000,  # Provide a reasonable gas limit
                        'gasPrice': web3.eth.gas_price,
                        'nonce': nonce,
                        'from': sender_address
                    })

                    tx_data = token_contract.functions.transfer(receiver_address, amount_in_smallest_unit).build_transaction({
                        'from': sender_address,
                        'gas': 0,
                        'gasPrice': 0,
                    })

                    gas_estimate = web3.eth.estimate_gas(tx_data)
                    gas_price = web3.eth.gas_price
                    gas_fee_wei = gas_estimate * gas_price

                    # Allow a 5% tolerance in gas fee
                    tolerance = 0.05
                    min_acceptable_fee = calculated_gas_fee * (1 - tolerance)
                    max_acceptable_fee = calculated_gas_fee * (1 + tolerance)

                    if min_acceptable_fee <= gas_fee_wei <= max_acceptable_fee:
                        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
                        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
                        return web3.to_hex(tx_hash)
                    else:
                        raise Exception(f"Gas fee out of acceptable range. Required: {calculated_gas_fee}, Actual: {gas_fee_wei}")

                # Retry on error
                tx_hash_hex = retry_on_specific_error(build_and_send_transaction)
                
                return JsonResponse({'success': True, 'tx_hash': tx_hash_hex})
            else:
                return JsonResponse({'success': False, 'error': 'Failed to connect to blockchain node'}, status=500)

        except Exception as e:
            logging.error(f"Error in crypto_token_transfer: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)