from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from mnemonic import Mnemonic
from bip44 import Wallet
from eth_account import Account

# Mapping of blockchain names to HD paths
BLOCKCHAIN_HD_PATHS = {
    'eth': "m/44'/60'/0'/0/0",
    'bnb': "m/44'/60'/0'/0/0",  # Binance Smart Chain uses the same as Ethereum
    'matic': "m/44'/60'/0'/0/0",  # Polygon also uses the same as Ethereum
    'zkEVM': "m/44'/60'/0'/0/0",  # zkEVM follows Ethereum standard
    'optimism': "m/44'/60'/0'/0/0",  # Optimism uses Ethereum's path
    'avax': "m/44'/60'/0'/0/0",  # Avalanche C-Chain also uses Ethereum's path
}

def generate_crypto_12_word(request):
    if request.method == 'GET':
        try:
            mnemo = Mnemonic("english")
            mnemonic_phrase = mnemo.generate(strength=128)  # 12-word mnemonic
            return JsonResponse({'success': True, 'mnemonic': mnemonic_phrase})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
    
    

def create_wallet_addresses(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            mnemonic_phrase = data.get('mnemonic_phrase')
            blockchain = data.get('blockchain').lower()

            if not mnemonic_phrase:
                return JsonResponse({'success': False, 'error': 'Missing mnemonic phrase'}, status=400)
            
            if blockchain not in BLOCKCHAIN_HD_PATHS:
                return JsonResponse({'success': False, 'error': 'Unsupported blockchain'}, status=400)

            mnemo = Mnemonic("english")
            if not mnemo.check(mnemonic_phrase):
                return JsonResponse({'success': False, 'error': 'Invalid mnemonic phrase'}, status=400)

            # Generate wallet for the specified blockchain
            wallet = Wallet(mnemonic_phrase)
            hd_path = BLOCKCHAIN_HD_PATHS[blockchain]
            private_key = wallet.private_key(hd_path)
            account = Account.privateKeyToAccount(private_key)

            response_data = {
                'success': True,
                'blockchain': blockchain,
                'address': account.address,
                'private_key': private_key.hex()  # Ensure private key is in hex format
            }
            return JsonResponse(response_data)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
