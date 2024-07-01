from channels.generic.websocket import AsyncWebsocketConsumer
import json

class TransactionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'transaction_updates'

        # Join room/group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room/group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_transaction_update(self, event):
        # Send transaction data to WebSocket
        await self.send(text_data=json.dumps(event))
