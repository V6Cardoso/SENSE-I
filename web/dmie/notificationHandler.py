import os
import requests
from requests.exceptions import ConnectionError, HTTPError

def send_push_message(token, title, message):
    tokens = []

    if isinstance(token, list):
        if len(token) > 50:
            for i in range(0, len(token), 50):
                tokens.append(token[i:i+50])
        else:
            tokens = token
    else:
        tokens = [token]

    responses = []
    for token in tokens:
        response = send_push_message_chunk(token, title, message)
        responses.append(response)
    return responses

def send_push_message_chunk(token, title, message):

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