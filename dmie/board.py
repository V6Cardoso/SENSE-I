from flask import Blueprint
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import url_for
from werkzeug.exceptions import abort

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


