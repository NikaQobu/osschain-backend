# osschain/consumers.py

import json
import asyncio
import websockets
from channels.generic.websocket import AsyncWebsocketConsumer

class WalletConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("WebSocket connection established")
        self.address = "0x683894f8dDE729F801CB495Cf3590170Cf5e9021"
        asyncio.create_task(self.listen_wallet())

    async def disconnect(self, close_code):
        print(f"WebSocket connection closed with code: {close_code}")

    async def receive(self, text_data):
        print(f"Message received: {text_data}")

    async def listen_wallet(self):
        uri = "wss://rpc.ankr.com/polygon/ws/f7c0df84b43c7f9f2c529c76efc01da4b30271a66608da4728f9830ea17d29bc"
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
                            "address": self.address
                        }
                    ]
                }

                await websocket.send(json.dumps(subscribe_message))
                print(f"Subscription message sent for wallet address: {self.address}")

                while True:
                    print("Waiting for response...")
                    response = await websocket.recv()
                    print(f"Received response: {response}")

                    data = json.loads(response)
                    if 'params' in data and 'result' in data['params']:
                        result = data['params']['result']
                        if 'topics' in result:
                            sender = result['topics'][1]
                            sender = f"0x{sender[26:]}"  # მისამართის ფორმატირება

                            amount_hex = result['data']
                            amount = int(amount_hex, 16) / (10 ** 18)  # თანხის გადაყვანა Ether-ში

                            print(f"Transaction from: {sender}, Amount: {amount} ETH")

        except websockets.exceptions.ConnectionClosed as e:
            print(f"WebSocket connection closed: {e}")
        except Exception as e:
            print(f"Connection failed: {e}")
