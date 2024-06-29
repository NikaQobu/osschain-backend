import websocket
import json

# WebSocket endpoint for Polygon mainnet
ws_endpoint = 'wss://ws.tatum.io/v3/polygon/mainnet/ws'

# Wallet address to monitor
address = '0x1f81A721C4D1CA4b54B71ad393918C2f7b59d2E4'

def on_message(ws, message):
    data = json.loads(message)
    if data['type'] == 'transfer' and data['address'] == address:
        print(f"New transfer detected for address {address}:")
        print(data)
        # Implement your notification logic here (e.g., send an email)

def on_error(ws, error):
    print(f"WebSocket Error: {error}")

def on_close(ws):
    print("WebSocket closed")

def on_open(ws):
    print("Connected to Tatum WebSocket")
    # Subscribe to address updates
    subscribe_msg = json.dumps({"type": "listen", "address": address})
    ws.send(subscribe_msg)

if __name__ == "__main__":
    websocket.enableTrace(True)  # Optional: Enable for debugging
    ws = websocket.WebSocketApp(ws_endpoint,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()