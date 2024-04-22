import os
import requests
from requests.exceptions import ConnectionError, HTTPError
import time
from datetime import datetime, timedelta
import dateutil.parser

from dmie.db import get_db
from .notificationHandler import send_push_message

import time


def get_current_incubators():
    current_time = int(time.time())
    db = get_db()
    return db.execute(
        "SELECT DISTINCT incubator FROM experiments WHERE startTimestamp < ? AND endTimestamp > ?",
        (current_time, current_time)
    ).fetchall()

def get_experiments_finished():
    current_time = int(time.time())
    db = get_db()
    return db.execute(
        "SELECT id, incubator FROM experiments WHERE endTimestamp < ?",
        (current_time,)
    ).fetchall()


def check_experiments(orion_data):

    finished_experiments = get_experiments_finished()
    for experiment in finished_experiments:
        experiment_id = experiment['id']
        affected_devices = get_affected_devices_push_tokens_experiments(experiment_id)
        print('Affected devices:', affected_devices)
        response = send_push_message(token=affected_devices, title='Experiment finished', message=f'Experiment {experiment_id} has finished')
        print(response)
        if response:
            delete_experiment(experiment_id)
                


    active_incubators = get_current_incubators()

    for incubator in active_incubators:
        incubator = incubator['incubator']

        for item in orion_data:
            if item['id'] == incubator:
                time_instant = dateutil.parser.parse(item['TimeInstant']['value'])
                time_instant_timestamp = time_instant.timestamp()
                current_timestamp = time.time()

                if current_timestamp - time_instant_timestamp > 5 * 60:
                    print(f'TimeInstant for {incubator} was published more than 5 minutes ago.')
                    push_tokens = get_affected_devices_push_tokens_incubator(incubator)
                    print('Affected devices:', push_tokens)

def get_affected_devices_push_tokens_experiments(experiment_id):
    db = get_db()
    push_tokens = db.execute(
        """
        SELECT device_id from device_experiments WHERE experiment_id = ?
        """,
        (experiment_id,)
    ).fetchall()
    
    return [token['device_id'] for token in push_tokens]
                    

def get_affected_devices_push_tokens_incubator(incubator):
    db = get_db()
    push_tokens = db.execute(
        """
        SELECT devices.pushToken
        FROM experiments
        JOIN device_experiments ON experiments.id = device_experiments.experiment_id
        JOIN devices ON device_experiments.device_id = devices.pushToken
        WHERE experiments.incubator = ?
        """,
        (incubator,)
    ).fetchall()

    return [token['pushToken'] for token in push_tokens]


def delete_experiment(experiment_id):
    db = get_db()
    db.execute(
        "DELETE FROM experiments WHERE id = ?",
        (experiment_id,)
    )
    db.execute(
        "DELETE FROM device_experiments WHERE experiment_id = ?",
        (experiment_id,)
    )
    db.commit()
    return True


        
        


    



