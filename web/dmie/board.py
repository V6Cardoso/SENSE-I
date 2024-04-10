from flask import Blueprint
from flask import render_template
from flask import request
from flask import current_app
from werkzeug.exceptions import abort


import requests
import json

from dmie.db import get_db

bp = Blueprint("board", __name__)


@bp.route("/")
def index():
    return render_template("board/dashboard.html")

@bp.route("/about")
def about():
    return render_template("board/about.html")

@bp.route("/setIP", methods=["POST"])
def setIP():
    form = request.form
    db = get_db()
    #check if the server is already in the database
    server = db.execute("SELECT * FROM server WHERE name = 'gcp'").fetchone()
    if server is None:
        db.execute("INSERT INTO server (name, url) VALUES ('gcp', ?)", (form['url'],))
    else:
        db.execute("UPDATE server SET url = ? WHERE name = 'gcp'", (form['url'],))
    db.commit()
    return "OK"



@bp.route("/getOrionData", methods=["POST"])
def getOrionData():

    db = get_db()
    
    url = db.execute("SELECT url FROM server WHERE name = 'gcp'").fetchone()
    url = url['url']

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
    db = get_db()
    
    url = db.execute("SELECT url FROM server WHERE name = 'gcp'").fetchone()
    url = url['url'] + ":8666/STH/v2/entities/" + form['device'] + '/attrs/' + form['attr']
    
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


