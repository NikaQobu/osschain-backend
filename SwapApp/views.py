import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Define the initial LI.FI API key URL and initial API key
INITIAL_API_KEY_URL = "https://li.quest/v1/keys/update"
INITIAL_API_KEY = "afd7a237-c1d6-4696-aa0f-9c02f8950930.ceecaad0-c7c8-49a1-8e8b-8fd89215c14b"

# Define the LI.FI API URL for swaps
LI_FI_API_URL = "https://li.quest/v1/quote"

# Placeholder for the new API key
NEW_API_KEY = None

def update_api_key():
    global NEW_API_KEY
    payload = {"name": "osschain"}
    headers = {
        "Content-Type": "application/json",
        "x-lifi-api-key": INITIAL_API_KEY,
    }

    response = requests.post(INITIAL_API_KEY_URL, json=payload, headers=headers)

    if response.status_code == 200:
        response_data = response.json()
        NEW_API_KEY = response_data.get("apiKey")
    else:
        raise Exception(f"Failed to update API key: {response.text}")

@csrf_exempt
def swap_tokens(request):
    global NEW_API_KEY
    if request.method == "POST":
        if NEW_API_KEY is None:
            try:
                update_api_key()
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)

        try:
            data = json.loads(request.body)
            from_token = data.get("from_token")
            to_token = data.get("to_token")
            amount = data.get("amount")
            user_address = data.get("user_address")
            from_chain = data.get("from_chain")
            to_chain = data.get("to_chain")

            if not all([from_token, to_token, amount, user_address, from_chain, to_chain]):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            payload = {
                "fromChain": from_chain,
                "toChain": to_chain,
                "fromToken": from_token,
                "toToken": to_token,
                "fromAddress": user_address,
                "toAddress": user_address,
                "amount": amount,
                "slippage": 0.03,  # Example slippage
                "integrator": "osschain",  # Include the integrator string
            }

            headers = {
                "Content-Type": "application/json",
                "x-api-key": NEW_API_KEY,  # Use the new API key
            }

            response = requests.post(LI_FI_API_URL, json=payload, headers=headers)

            # Debug: Print the status code and response text
            print(f"Response status code: {response.status_code}")
            print(f"Response content: {response.text}")

            try:
                response_data = response.json()
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid response from LI.FI API"}, status=500)

            if response.status_code == 200:
                return JsonResponse(response_data)
            else:
                return JsonResponse(response_data, status=response.status_code)
        except json.JSONDecodeError as e:
            # Debug: Print the JSON decode error
            print(f"JSON decode error: {e}")
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)
        except requests.RequestException as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

# Assuming you are running this in a Django environment,
# you would need to map these views to URLs in your urls.py file for actual deployment.
