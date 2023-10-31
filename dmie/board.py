from flask import Blueprint
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import url_for
from flask import current_app
from werkzeug.exceptions import abort


import requests
import json

from dmie.auth import login_required
from dmie.db import get_db

bp = Blueprint("board", __name__)


@bp.route("/")
def index():
    return render_template("board/guest.html")

@bp.route("/dashboard")
@login_required
def dashboard():
    return render_template("board/dashboard.html")

@bp.route("/about")
def about():
    return render_template("board/about.html")



@bp.route("/getOrionData", methods=["POST"])
def getOrionData():
    url = "http://20.195.208.173:1026/v2/entities"
    headers = {
        'fiware-service': 'smart',
        'fiware-servicepath': '/',
        'Accept': 'application/json'
    }
    response = requests.request("GET", url, headers=headers)
    print(response)
    return response.json()
    



@bp.route('/service-worker.js', methods=['GET'])
def sw():
    return current_app.send_static_file('service-worker.js')


