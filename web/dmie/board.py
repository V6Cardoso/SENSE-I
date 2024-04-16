from flask import Blueprint
from flask import render_template
from flask import request
from flask import current_app
from werkzeug.exceptions import abort

from .notificationHandler import send_push_message

import os
from dotenv import load_dotenv
load_dotenv()

from dmie.db import get_db


import requests
import json

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
    db.execute(
        "INSERT INTO devices (pushToken) VALUES (?)",
        (form['pushToken'],)
    )
    db.commit()
    return "Device added"



@bp.route("/addExperiment", methods=["POST"])
def addExperiment():
    form = request.form
    db = get_db()
    db.execute(
        "INSERT INTO experiments (name, incubator, temperature, temperatureLowThreshold, temperatureHighThreshold, humidity, humidityLowThreshold, humidityHighThreshold, startTimestamp, endTimestamp, createdTimestamp, observation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (form['name'], form['incubator'], form['temperature'], form['temperatureLowThreshold'], form['temperatureHighThreshold'], form['humidity'], form['humidityLowThreshold'], form['humidityHighThreshold'], form['startTimestamp'], form['endTimestamp'], form['createdTimestamp'], form['observation'])
    )
    db.commit()
    return "Experiment added"

@bp.route("/getExperiments", methods=["POST"])
def getExperiments():
    db = get_db()
    experiments = db.execute("SELECT * FROM experiments").fetchall()
    return json.dumps(experiments)

@bp.route("/deleteExperiment", methods=["POST"])
def deleteExperiment():
    form = request.form
    db = get_db()
    db.execute("DELETE FROM experiments WHERE id = ?", (form['id'],))
    db.commit()
    return "Experiment deleted"


@bp.route("/getDevices", methods=["POST"])
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

@bp.route("/getSthCometData", methods=["POST"])
def getSthCometData():
    form = request.form
    
    url = os.getenv('IP')
    if url is None:
        return "No env IP"
    
    url = url + ":8666/STH/v2/entities/" + form['device'] + '/attrs/' + form['attr']
    
    headers = {
        'fiware-service': 'smart',
        'fiware-servicepath': '/'
    }

    params = {
        'type': 'estufa',
        'lastN': int(form['lastN']) if form['lastN'] else None,
        'hLimit': int(form['hLimit']) if form['hLimit'] else None,
        'hOffset': int(form['hOffset']) if form['hOffset'] else None,
        'dateFrom': form['dateFrom'] if form['dateFrom'] else None,
        'dateTo': form['dateTo'] if form['dateTo'] else None
    }
    
    response = requests.request("GET", url, headers=headers, params=params)
    return response.json()
    
    



@bp.route('/service-worker.js', methods=['GET'])
def sw():
    return current_app.send_static_file('service-worker.js')


