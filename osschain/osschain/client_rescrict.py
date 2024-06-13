from django.core.cache import cache
import time

def is_rate_limited(user_key, limit=5, timeout=1):
    current_time = time.time()
    requests = cache.get(user_key, [])

    # Filter out requests that are older than timeout
    requests = [req for req in requests if current_time - req < timeout]
    
    if len(requests) >= limit:
        return True

    requests.append(current_time)
    cache.set(user_key, requests, timeout)

    return False

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
