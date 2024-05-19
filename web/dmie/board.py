from flask import Blueprint
from flask import render_template
from flask import request
from flask import current_app
from werkzeug.exceptions import abort

from datetime import datetime, timezone

from .notificationHandler import send_push_message
from .dataMonitoringServer import check_experiments

import os
from dotenv import load_dotenv
load_dotenv()

from dmie.db import get_db

import uuid


import requests
import json
from apscheduler.schedulers.background import BackgroundScheduler

bp = Blueprint("board", __name__)


@bp.route("/")
def index():
    return render_template("board/dashboard.html")

@bp.route("/about")
def about():
    return render_template("board/about.html")

@bp.route("/pushNotification", methods=["POST"])
def pushNotification():
    return send_push_message(token=request.form['token'], title=request.form['title'], message=request.form['message'])


@bp.route("/addDevice", methods=["POST"])
def addDevice():
    form = request.form
    db = get_db()
    existing_device = db.execute(
        "SELECT * FROM devices WHERE pushToken = ?",
        (form['pushToken'],)
    ).fetchone()

    if existing_device is None:
        db.execute(
            "INSERT INTO devices (pushToken) VALUES (?)",
            (form['pushToken'],)
        )
    else:
        return "Device with this pushToken already exists"
    db.commit()
    return "Device added"



@bp.route("/addExperiment", methods=["POST"])
def addExperiment():
    data = request.get_json()
    print(data)
    experiment = data.get('experiment')
    token = data.get('pushToken')

    id = str(uuid.uuid4())

    db = get_db()
    try:
        db.execute(
            "INSERT INTO experiments (id, name, incubator, temperature, temperatureLowThreshold, temperatureHighThreshold, humidity, humidityLowThreshold, humidityHighThreshold, startTimestamp, endTimestamp, createdTimestamp, observation, owner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (id ,experiment.get('name'), experiment.get('incubator'), experiment.get('temperature'), experiment.get('temperatureLowThreshold'), experiment.get('temperatureHighThreshold'), experiment.get('humidity'), experiment.get('humidityLowThreshold'), experiment.get('humidityHighThreshold'), experiment.get('startTimestamp'), experiment.get('endTimestamp'), experiment.get('createdTimestamp'), experiment.get('observation'), experiment.get('owner'))
        )
        db.commit()

        db.execute(
            "INSERT INTO device_experiments (device_id, experiment_id) VALUES (?, ?)",
            (token, id)
        )
        db.commit()
        
        return id
    except Exception as e:
        print('e -> ', e)
        return str(e)
    
@bp.route("/getExperiment", methods=["POST"])
def getExperiment():
    form = request.form
    db = get_db()
    experiment = db.execute("SELECT id, name, incubator, temperature, temperatureLowThreshold, temperatureHighThreshold, humidity, humidityLowThreshold, humidityHighThreshold, startTimestamp, endTimestamp, createdTimestamp, observation FROM experiments WHERE id = ?", (form['id'],)).fetchone()
    if experiment is None:
        return json.dumps(False)
    
    return json.dumps(dict(experiment))

@bp.route("/deleteExperiment", methods=["POST"])
def deleteExperiment():
    form = request.form
    db = get_db()
    deleted = db.execute("DELETE FROM experiments WHERE id = ? AND owner = ?", (form['id'], form['owner']))
    if deleted.rowcount == 0:
        return "Experiment not found"
    db.execute("DELETE FROM device_experiments WHERE experiment_id = ?", (form['id'],))
    db.commit()
    return "Experiment deleted"


@bp.route("/getDevices")
def getDevices():
    url = os.getenv('IP')
    if url is None:
        return "No env IP"

    url = url + ":4041/iot/devices"
    
    headers = {
        'fiware-service': 'smart',
        'fiware-servicepath': '/'
    }
    response = requests.request("GET", url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        devices = [{"device_id": device["device_id"], "entity_name": device["entity_name"]} for device in data["devices"]]
        return devices
    else:
        return "Error: " + response.reason


@bp.route("/getOrionData", methods=["POST"])
def getOrionData():
    url = os.getenv('IP')
    if url is None:
        return "No env IP"

    url = url + ":1026/v2/entities"
    
    headers = {
        'fiware-service': 'smart',
        'fiware-servicepath': '/',
        'Accept': 'application/json'
    }
    response = requests.request("GET", url, headers=headers)
    return response.json()



@bp.route("/sthCometV2", methods=["POST"])
def sthCometV2():
    data = request.form
    result = getSthCometData(data['dateFrom'], data['dateTo'], data['device'], data['attr'], data['samples'])
    return result


def getSthCometData(dateFrom, dateTo, device, attr, samples):

    url = os.getenv('IP')
    if url is None:
        return "No env IP"
    
    url = url + ":8666/STH/v2/entities/" + device + '/attrs/' + attr

    headers = {
        'fiware-service': 'smart',
        'fiware-servicepath': '/'
    }

    responses = []
    start_date = dateFrom # ISO 8601
    end_date = dateTo # ISO 8601

    while start_date < end_date:
        params = {
            'type': 'estufa',
            'hLimit': 100,
            'hOffset': 1,
            'dateFrom': start_date,
            'dateTo': end_date
        }
        response = requests.request("GET", url, headers=headers, params=params)
        if response.status_code == 200:

            response_formatted = response.json()
            data_value = response_formatted.get('value')
            if not data_value:
                break
            responses.extend(data_value)
            start_date = data_value[-1]['recvTime']
        else:
            return "Error: " + response.reason
    
    extracted_data = extract_date_and_value(responses)
    print('len(extracted_data) -> ', len(extracted_data))

    samples = int(samples) if samples.isdigit() else samples
    if samples != '':
        variavel = convert_average_data(extracted_data, samples)
        print(variavel)
        return variavel
    else:
        return extracted_data



def extract_date_and_value(data):
    formatted_data = []
    for item in data:
        if item['attrValue'] != 'nan':
            formatted_data.append({
                'date': item['recvTime'],
                'value': float(item['attrValue'])
            })
    return formatted_data

def convert_average_data(data, n):
    average_data = []
    data_length = len(data)
    chunk_size = data_length // n

    if chunk_size == 0:
        return data

    for i in range(n):
        chunk = data[i*chunk_size:(i+1)*chunk_size]
        if not chunk:
            break

        average_date = find_average_date([datetime.fromisoformat(item['date'].replace('Z', '+00:00')) for item in chunk])
        average_value = sum([item['value'] for item in chunk]) / len(chunk)
        average_value = round(average_value, 2)
        average_data.append({
            'date': average_date,
            'value': average_value
        })

    return average_data

def find_average_date(dates):
    timestamps = [date.timestamp() for date in dates]
    average_timestamp = sum(timestamps) / len(timestamps)
    average_date = datetime.fromtimestamp(average_timestamp, tz=timezone.utc)
    return average_date.isoformat().replace('+00:00', 'Z')


@bp.route('/service-worker.js', methods=['GET'])
def sw():
    return current_app.send_static_file('service-worker.js')

def job():
    from flask import Flask

    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        # a default secret that should be overridden by instance config
        SECRET_KEY="dev",
        # store the database in the instance folder
        DATABASE=os.path.join(app.instance_path, "dmie.sqlite"),
    )
    with app.app_context():
        orion_data = getOrionData()
        check_experiments(orion_data)

    return "Job done"

scheduler = BackgroundScheduler({'apscheduler.job_defaults.max_instances': 2})
scheduler.add_job(job, 'interval', minutes=1)
scheduler.start()

