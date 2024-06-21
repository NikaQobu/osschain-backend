from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def receive_socket_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received data:", data)  # დაბეჭდეთ მიღებული მონაცემები კონსოლში

            # დაალაგეთ მონაცემები
            matched_receipts = data.get('matchedReceipts', [])
            matched_transactions = data.get('matchedTransactions', [])

            # ლოგების ბეჭდვა
            for receipt in matched_receipts:
                print("Matched Receipt:")
                print("Block Hash:", receipt.get('blockHash'))
                print("Transaction Hash:", receipt.get('transactionHash'))
                print("From:", receipt.get('from'))
                print("To:", receipt.get('to'))
                print("Gas Used:", receipt.get('gasUsed'))
                print("Logs:", receipt.get('logs'))
                print("------------")

            # ტრანზაქციების ბეჭდვა
            for transaction in matched_transactions:
                print("Matched Transaction:")
                print("Block Hash:", transaction.get('blockHash'))
                print("Transaction Hash:", transaction.get('hash'))
                print("From:", transaction.get('from'))
                print("To:", transaction.get('to'))
                print("Value:", transaction.get('value'))
                print("Gas:", transaction.get('gas'))
                print("Gas Price:", transaction.get('gasPrice'))
                print("------------")

            return JsonResponse({"status": "success"}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
