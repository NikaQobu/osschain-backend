import asyncio
import json
import websockets
from django.core.management.base import BaseCommand
from web3 import Web3

# JSON-RPC request formation function
def create_req_body(r_id, method, params):
    return json.dumps({
        "jsonrpc": "2.0",
        "id": r_id,
        "method": method,
        "params": params
    })

# Function to format balance in Ether
def format_ether(balance):
    return Web3.fromWei(int(balance, 16), 'ether')

# WebSocket listener function to monitor wallet transactions
async def listen_for_wallet_transactions(url, wallet_address):
    previous_balance = None

    try:
        async with websockets.connect(url) as websocket:
            print("Connected to WebSocket")

            # Subscribe to new logs for the specified address
            subscription_request = create_req_body(
                1, "eth_subscribe", ["logs", {"address": wallet_address}]
            )
            await websocket.send(subscription_request)
            print(f"Sent subscription request: {subscription_request}")

            while True:
                response = await websocket.recv()
                print(f"Received raw response: {response}")

                response_data = json.loads(response)
                print(f"Decoded response: {response_data}")

                # Check if the response contains a subscription confirmation
                if 'id' in response_data:
                    print(f"Subscription confirmed with ID: {response_data['result']}")
                    continue

                # Check if the response contains transaction log data
                if 'params' in response_data and 'result' in response_data['params']:
                    log_data = response_data['params']['result']
                    print(f"Log data received: {log_data}")

                    if log_data.get('address').lower() == wallet_address.lower():
                        print(f"Transaction related to monitored address detected: {log_data}")

                        # Print log details
                        print(f"Transaction Hash: {log_data.get('transactionHash')}")
                        print(f"Block Hash: {log_data.get('blockHash')}")
                        print(f"Block Number: {int(log_data.get('blockNumber', '0x0'), 16)}")
                        print(f"Gas Used: {int(log_data.get('gasUsed', '0x0'), 16)}")
                        print(f"Log Index: {int(log_data.get('logIndex', '0x0'), 16)}")
                        print(f"Data: {log_data.get('data')}")
                        print(f"Topics: {log_data.get('topics')}")

                        # Request additional transaction details
                        tx_hash = log_data.get('transactionHash')
                        tx_details_request = create_req_body(2, "eth_getTransactionByHash", [tx_hash])
                        await websocket.send(tx_details_request)
                        tx_response = await websocket.recv()
                        tx_response_data = json.loads(tx_response)
                        print(f"Transaction details: {tx_response_data}")

                        if 'result' in tx_response_data and tx_response_data['result']:
                            tx = tx_response_data['result']
                            print(f"Transaction details: {tx}")

                            # Check balance after the transaction
                            balance_request = create_req_body(3, "eth_getBalance", [wallet_address, "latest"])
                            await websocket.send(balance_request)
                            balance_response = await websocket.recv()
                            balance_data = json.loads(balance_response)
                            print(f"Balance response: {balance_data}")

                            if 'result' in balance_data:
                                balance_wei = balance_data['result']
                                balance_eth = format_ether(balance_wei)
                                print(f"New balance for {wallet_address}: {balance_eth} ETH")

                                if previous_balance is None:
                                    previous_balance = balance_eth
                                elif previous_balance != balance_eth:
                                    print(f"Balance change detected for {wallet_address}: {balance_eth} ETH")
                                    previous_balance = balance_eth
                            else:
                                print("Failed to retrieve balance data.")
                        else:
                            print("Failed to retrieve transaction details.")
                    else:
                        print("Log data not relevant to the monitored address.")
                else:
                    print("No valid transaction data received.")
    except Exception as e:
        print(f"Failed to connect to WebSocket: {e}")

# Django management command class
class Command(BaseCommand):
    help = 'Listen to wallet transactions and print balance changes in the terminal.'

    def handle(self, *args, **kwargs):
        url = 'wss://smart-light-sunset.matic.quiknode.pro/377f345fe2ade3349b7aa65b24e0559de923f3b4/'  # Replace with your WebSocket URL
        wallet_address = "0x683894f8dDE729F801CB495Cf3590170Cf5e9021".lower()  # Replace with your wallet address
        asyncio.run(listen_for_wallet_transactions(url, wallet_address))
