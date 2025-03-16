import asyncio
import websockets
import json
from django.test import TestCase

class WebSocketTest(TestCase):
    async def connect_and_listen(self):
        uri = "wss://rpc.ankr.com/polygon/ws/f7c0df84b43c7f9f2c529c76efc01da4b30271a66608da4728f9830ea17d29bc"
        wallet_address = "0x683894f8dDE729F801CB495Cf3590170Cf5e9021"

        try:
            print(f"Connecting to {uri}")
            async with websockets.connect(uri) as websocket:
                print("Connected to WebSocket")

                subscribe_message = {
                    "id": 1,
                    "method": "eth_subscribe",
                    "params": [
                        "logs",
                        {
                            "address": wallet_address
                        }
                    ]
                }

                await websocket.send(json.dumps(subscribe_message))
                print(f"Subscription message sent for wallet address: {wallet_address}")

                while True:
                    print("Waiting for response...")
                    response = await websocket.recv()
                    print(f"Received response: {response}")

                    data = json.loads(response)
                    if 'params' in data and 'result' in data['params']:
                        result = data['params']['result']
                        if 'topics' in result:
                            sender = result['topics'][1]
                            sender = f"0x{sender[26:]}"

                            amount_hex = result['data']
                            amount = int(amount_hex, 16) / (10 ** 18)

                            print(f"Transaction from: {sender}, Amount: {amount} ETH")

        except websockets.exceptions.ConnectionClosed as e:
            print(f"WebSocket connection closed: {e}")
        except Exception as e:
            print(f"Error: {e}")

    def test_websocket_connection(self):
        asyncio.run(self.connect_and_listen())
