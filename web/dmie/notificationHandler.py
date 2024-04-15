import os
import requests
from requests.exceptions import ConnectionError, HTTPError

def send_push_message(token, title, message):
    message = {
        'to': token,
        'title': title,
        'body': message
    }
    messages = [message]
    
    try:
        response = requests.post(
            "https://exp.host/--/api/v2/push/send",
            headers={
                "Host": "exp.host",
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            json=messages,
        )
        return response.json()
    except ConnectionError as e:
        print(f"Failed to send notification: {e}")
        return
    except HTTPError as e:
        print(f"Failed to send notification: {e}")
        return