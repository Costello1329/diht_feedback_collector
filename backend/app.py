import uuid

from flask import Flask, request, Response
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum
import json
import re

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)


################################################################################
# Database models:                                                             #
################################################################################


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guid = db.Column(db.Integer, db.ForeignKey("guid.guid"))
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
# Main methods and utils:                                                      #
################################################################################


class ResponseErrorType(Enum):
    Contract = "contract"
    Validation = "validation"
    Internal = "internal"


def get_response_error_string_by_type(error_type):
    if error_type == ResponseErrorType.Contract:
        return "contract"

    if error_type == ResponseErrorType.Validation:
        return "validation"

    if error_type == ResponseErrorType.Internal:
        return "internal"


def setup_cors_response_headers(res):
    res.headers["Access-Control-Allow-Origin"] = "http://127.0.0.1:1329"
    res.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    res.headers["Access-Control-Allow-Headers"] = \
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    return res


################################################################################
# Registration service:                                                        #
################################################################################


def validate_registration_contract(req):
    try:
        user_data = req.get_json()

        if re.match("application/json", req.headers["Content-Type"]) is None:
            return False

        all_needed_keys_exist =\
            "token" in user_data.keys() \
            and "login" in user_data.keys() \
            and "password" in user_data.keys() \
            and "confirmation" in user_data.keys()

        all_types_valid =\
            isinstance(user_data["token"], str) \
            and isinstance(user_data["login"], str) \
            and isinstance(user_data["password"], str) \
            and isinstance(user_data["confirmation"], str)

        return all_needed_keys_exist and all_types_valid

    except Exception:
        return False


def validate_registration_data(token, login, password, confirmation):
    is_token_valid =\
        re.fullmatch("[a-z0-9]{8}[-][a-z0-9]{4}[-][a-z0-9]{4}[-][a-z0-9]{4}[-][a-z0-9]{12}", token) is not None

    is_login_valid =\
        re.fullmatch("[a-zA-Z0-9-]*", login) is not None \
        and len(login) >= 8

    is_password_valid =\
        re.fullmatch("[a-fA-F0-9]{32}", password) is not None

    is_confirmation_valid =\
        password == confirmation

    return is_token_valid and is_login_valid and is_password_valid and is_confirmation_valid


def get_registration_response_success(
        does_token_exist,
        is_token_unactivated,
        is_login_unique
):
    body = {
        "doesTokenExist": does_token_exist,
        "isTokenUnactivated": is_token_unactivated,
        "isLoginUnique": is_login_unique
    }

    return setup_cors_response_headers(Response(json.dumps(body), status=200, mimetype="application/json"))


def get_registration_response_error(error_type, status_code):
    body = {
        "errorType": get_response_error_string_by_type(error_type)
    }

    return setup_cors_response_headers(Response(json.dumps(body), status=status_code, mimetype="application/json"))


@app.route("/registration", methods=["POST"], provide_automatic_options=False)
def handle_registration():
    try:
        # Contract validation:
        contract_validation_passed = validate_registration_contract(request)

        if not contract_validation_passed:
            return get_registration_response_error(ResponseErrorType.Contract, 400)

        # Contract is observed:
        else:
            user_data = request.get_json()

            # Data validation:
            data_validation_passed = validate_registration_data(
                user_data["token"],
                user_data["login"],
                user_data["password"],
                user_data["confirmation"])

            if not data_validation_passed:
                return get_registration_response_error(ResponseErrorType.Validation, 400)

            # Data passed the validation:
            else:
                # Database-side validations:
                guid = Guid.query.filter_by(guid=user_data["token"]).first()
                does_token_exist = guid is not None
                is_token_unactivated = (not does_token_exist) or (not guid.active)
                is_login_unique = Users.query.filter_by(login=user_data['login']).first() is None

                all_is_valid =\
                    does_token_exist is True \
                    and is_token_unactivated is True \
                    and is_login_unique is True

                if all_is_valid:
                    user = Users(login=user_data["login"], password=user_data["password"], guid=guid.guid)
                    db.session.add(user)
                    guid.active = True
                    db.session.add(guid)
                    db.session.commit()

                return get_registration_response_success(
                    does_token_exist,
                    is_token_unactivated,
                    is_login_unique)

    except Exception:
        return get_registration_response_error(ResponseErrorType.Internal, 500)


@app.route("/registration", methods=["OPTIONS"], provide_automatic_options=False)
def handle_options_registration():
    return setup_cors_response_headers(Response())


################################################################################
# Authorization service:                                                       #
################################################################################


k_cookie_expiration_time = 2 * 7 * 24 * 60 * 60  # (2 weeks in seconds)


class SessionsStorage:
    sessions: dict()

    def __init__(self):
        self.sessions = dict()

    @staticmethod
    def check_session_for_expiration(session):
        return (datetime.now(tz=None) - session.last_activity).total_seconds() <= k_cookie_expiration_time

    def create_session(self, user_guid, session_guid):
        self.sessions.update({session_guid: Session(user_guid)})

    def update_session(self, session_guid):
        session = self.get_session(session_guid)
        session.last_activity = datetime.now(tz=None)
        self.sessions.update({session_guid: session})

    def delete_session(self, session_guid):
        self.sessions.pop(session_guid, None)

    def get_session(self, session_guid):
        session = self.sessions.get(session_guid, None)

        if session is None:
            return None

        elif self.check_session_for_expiration(session) is False:
            self.delete_session(session_guid)
            return None

        else:
            return session


class Session:
    user_guid: str
    last_activity: datetime

    def __init__(self, user_guid):
        self.user_guid = user_guid
        self.last_activity = datetime.now(tz=None)


sessions_storage = SessionsStorage()


def validate_authorization_contract(req):
    try:
        user_data = req.get_json()

        if re.match("application/json", req.headers["Content-Type"]) is None:
            return False

        all_needed_keys_exist =\
            "login" in user_data.keys() \
            and "password" in user_data.keys()

        all_types_valid =\
            isinstance(user_data["login"], str) \
            and isinstance(user_data["password"], str)

        return all_needed_keys_exist and all_types_valid

    except Exception:
        return False


def validate_authorization_data(login, password):
    is_login_valid =\
        len(login) > 0

    is_password_valid =\
        re.fullmatch("[a-fA-F0-9]{32}", password) is not None

    return is_login_valid and is_password_valid


def get_authorization_response_success(does_login_exist, is_password_valid, session_guid):
    status = 200 if session_guid is not None else 401

    body = {
        "does_login_exist": does_login_exist,
        "is_password_valid": is_password_valid
    }

    res = setup_cors_response_headers(Response(json.dumps(body), status=status, mimetype="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value=session_guid, max_age=k_cookie_expiration_time)

    else:
        res.set_cookie("session", expires=0)

    return res


def get_authorization_response_error(error_type, status_code):
    body = {
        "errorType": get_response_error_string_by_type(error_type)
    }

    return setup_cors_response_headers(Response(json.dumps(body), status=status_code, mimetype="application/json"))


@app.route("/authorization", methods=["POST"], provide_automatic_options=False)
def handle_authorization():
    try:
        # Contract validation:
        contract_validation_passed = validate_authorization_contract(request)

        if not contract_validation_passed:
            return get_authorization_response_error(ResponseErrorType.Contract, 400)

        # Contract is observed:
        else:
            user_data = request.get_json()

            # Data validation:
            data_validation_passed = validate_authorization_data(
                user_data["login"],
                user_data["password"])

            if not data_validation_passed:
                return get_authorization_response_error(ResponseErrorType.Validation, 400)

            # Data passed the validation:
            else:
                # Database-side validations:
                user = Users.query.filter_by(login=user_data["login"]).first()
                does_login_exist = user is not None
                is_password_valid = (not does_login_exist) or (user.check_password(user_data["password"]))
                all_is_valid = \
                    does_login_exist is True \
                    and is_password_valid is True

                session_guid = None

                if all_is_valid:
                    session_guid = uuid.uuid4().hex
                    global sessions_storage
                    sessions_storage.create_session(user.guid, session_guid)

                return get_authorization_response_success(
                    does_login_exist,
                    is_password_valid,
                    session_guid)

    except Exception:
        return get_registration_response_error(ResponseErrorType.Internal, 500)


@app.route("/authorization", methods=["OPTIONS"], provide_automatic_options=False)
def handle_options_authorization():
    return setup_cors_response_headers(Response())


################################################################################
# User service:                                                                #
################################################################################


def get_user_response_success(login, role, session_guid):
    body = {
        "login": login,
        "role": role
    }

    res = setup_cors_response_headers(Response(json.dumps(body), status=200, mimetype="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value=session_guid, max_age=k_cookie_expiration_time)

    return res


def get_user_response_reject(session_guid):
    res = setup_cors_response_headers(Response(status=401, mimetype="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value="", expires=0)

    return res


def get_user_response_error(error_type, status_code):
    body = {
        "errorType": get_response_error_string_by_type(error_type)
    }

    return setup_cors_response_headers(Response(json.dumps(body), status=status_code, mimetype="application/json"))


@app.route("/user", methods=["GET"], provide_automatic_options=False)
def handle_user():
    try:
        # Database-side validations:
        session_guid = request.cookies.get("session", None)

        if session_guid is None:
            return get_user_response_reject(session_guid)

        global sessions_storage
        session = sessions_storage.get_session(session_guid)

        if session is None:
            return get_user_response_reject(session_guid)

        sessions_storage.update_session(session_guid)
        user = Users.query.filter_by(guid=session.user_guid).first()

        return get_user_response_success(
            user.login,
            user.role,
            session_guid)

    except Exception:
        return get_registration_response_error(ResponseErrorType.Internal, 500)


@app.route("/user", methods=["OPTIONS"], provide_automatic_options=False)
def handle_options_user():
    return setup_cors_response_headers(Response())


################################################################################
# main:                                                                        #
################################################################################


if __name__ == "__main__":
    app.run(debug=True)
