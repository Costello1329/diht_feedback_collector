import uuid

from flask import Flask, request, Response
from flask import abort
from flask import jsonify
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, time

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS '] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)


################################################################################
# Database models:                                                             #
################################################################################


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guid = db.Column(db.Integer, db.ForeignKey('guid.guid'))
    role = db.Column(db.String(20), default="student", unique=False, nullable=True)
    login = db.Column(db.String(30), unique=True, nullable=True)
    password = db.Column(db.String(16), unique=False, nullable=True)

    def check_password(self, password):
        return self.password == password


class Guid(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guid = db.Column(db.Integer, unique=True)
    group = db.Column(db.String(20), unique=False, nullable=False)
    active = db.Column(db.BOOLEAN(), default=False, unique=False, nullable=False)


################################################################################
# Registration service:                                                        #
################################################################################


def get_registration_response(is_token_valid, is_token_unactivated, is_confirmation_valid, is_login_valid):
    res = jsonify(
        isTokenValid=is_token_valid,
        isTokenUnactivated=is_token_unactivated,
        isConfirmationValid=is_confirmation_valid,
        isLoginValid=is_login_valid
    )
    res.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    res.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    res.headers["Access-Control-Allow-Headers"] = \
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    is_all_valid = (
        is_token_valid is True and
        is_token_unactivated is True and
        is_confirmation_valid is True and
        is_login_valid is True
    )

    res.status_code = 200 if is_all_valid else 400
    return res


def get_registration_response_error(status_code):
    res = Response()
    res.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    res.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    res.headers["Access-Control-Allow-Headers"] = \
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    res.status_code = status_code
    return res


@app.route("/register", methods=["POST"], provide_automatic_options=False)
def reg():
    if request.method != "POST":
        return get_registration_response_error(status_code=405)

    user_data = request.get_json()

    if user_data is None:
        return get_registration_response_error(status_code=400)

    try:
        guid = Guid.query.filter_by(guid=user_data["token"]).first()

        if guid is None:
            return get_registration_response(False, "undefined", "undefined", "undefined")

        if guid.active:
            return get_registration_response(True, False, "undefined", "undefined")

        if user_data["password"] != user_data["confirmation"]:
            return get_registration_response(True, True, False, "undefined")

        if Users.query.filter_by(login=user_data['login']).first() is not None:
            return get_registration_response(True, True, True, False)

        user = Users(login=user_data['login'], password=user_data['password'], guid=guid.guid)
        db.session.add(user)
        guid.active = True
        db.session.add(guid)
        db.session.commit()
    except():
        return get_registration_response_error(status_code=500)

    return get_registration_response(True, True, True, True)


################################################################################
# Authorization service:                                                       #
################################################################################


class Tokens:
    data: dict()

    def __init__(self):
        self.data = dict()

    def add_token(self, token, user_guid):
        self.data.update({token: Session(user_guid)})

    def check_token(self, token):
        if self.data.get(token) is None:
            return False
        else:
            return True

    def clear_data(self):
        self.data.clear()

    def get_user_data(self, token):
        data = self.data.get(token)
        if data is not None:
            return data.user_guid
        else:
            return None


class Session:
    user_guid: str
    last_activity: datetime

    def __init__(self, user_guid):
        self.user_guid = user_guid
        self.last_activity = datetime.now(tz=None)


tokens = Tokens()


def get_authorization_response_body(is_login_exists, is_password_valid):
    return jsonify(
        isLoginExist=is_login_exists,
        isPasswordValid=is_password_valid
    )


@app.route('/authorize', methods=['POST'], provide_automatic_options=False)
def authorize():
    user_data = request.get_json()

    if request.method != "POST":
        return abort(405)

    if user_data is None:
        return abort(400)

    try:
        user = Users.query.filter_by(login=user_data['login']).first()
        if user is None:
            return get_authorization_response_body(False, "undefined"), 401
        if not user.check_password(user_data["password"]):
            return get_authorization_response_body(True, False), 401
    except():
        return abort(500)

    auth_token = uuid.uuid4().hex
    global tokens
    tokens.add_token(auth_token, Users.guid)

    res = get_authorization_response_body(True, True)
    res.set_cookie("auth-token", value=auth_token)
    return res


def get_user_response_body(login, role):
    return jsonify(
        login=login,
        role=role
    )


@app.route('/user', methods=['POST'], provide_automatic_options=False)
def get_user_data():
    user_data = request.get_json()

    if request.method != "POST":
        return abort(405)

    if user_data is None:
        return abort(400)

    try:
        token = request.cookies['auth-token']
        global tokens
        user_guid = tokens.get_user_data(token)

        if user_guid is None:
            return abort(401)

        user = Users.query.filter_by(guid=user_guid).first()
        if user is None:
            return abort(401)

        res = jsonify(
            login=user.login,
            role=user.role)
    except():
        return abort(500)

    return res


################################################################################
# Options handling for xhr http-clients:                                       #
################################################################################


@app.route("/authorize", methods=["OPTIONS"], provide_automatic_options=False)

def handle_options_request_for_authorization():
    return setup_xhr_request_headers()


@app.route("/register", methods=["OPTIONS"], provide_automatic_options=False)
def handle_options_request_for_registration():
    return setup_xhr_request_headers()


# This is a necessary handler for xhr cross-domain requests.
# When HTTP-client on frontend sends a xhr request to server,
# browser automatically sends options request to check it's
# rights (so we need to provide some rights to it).
def setup_xhr_request_headers():
    return "", 204, get_headers_for_cors_requests()


def get_headers_for_cors_requests():
    return {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization"
        }


################################################################################
# main:                                                                        #
################################################################################


if __name__ == '__main__':
    app.run(debug=True)
