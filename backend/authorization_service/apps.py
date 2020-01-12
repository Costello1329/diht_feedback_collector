from datetime import datetime
import re

from django.apps import AppConfig
from rest_framework.response import Response
import json

from diht_feedback_collector.apps import setup_cors_response_headers, get_response_error_string_by_type
from registration_services.models import People


class AuthorizationServiceConfig(AppConfig):
    name = 'authorization_service'


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

    def get_user_guid(self):
        return self.user_guid

    def __init__(self, user_guid):
        self.user_guid = user_guid
        self.last_activity = datetime.now(tz=None)


sessions_storage = SessionsStorage()


def validate_authorization_contract(req):
    try:
        user_data = req.data

        if re.match("application/json", req.headers["Content-Type"]) is None:
            return False

        if len(user_data.keys()) != 2:
            return False
        all_needed_keys_exist = \
            "login" in user_data.keys() \
            and "password" in user_data.keys()

        all_types_valid = \
            isinstance(user_data["login"], str) \
            and isinstance(user_data["password"], str)

        return all_needed_keys_exist and all_types_valid

    except Exception:
        return False


def validate_authorization_data(login, password):
    is_login_valid = \
        len(login) > 0

    is_password_valid = \
        re.fullmatch("[a-fA-F0-9]{32}", password) is not None

    return is_login_valid and is_password_valid


def get_authorization_response_success(does_login_exist, is_password_valid, session_guid):
    status = 200 if session_guid is not None else 401

    body = {
        "doesLoginExist": does_login_exist,
        "isPasswordCorrect": is_password_valid
    }

    res = setup_cors_response_headers(Response(json.dumps(body), status=status, content_type="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value=session_guid, max_age=k_cookie_expiration_time)

    else:
        res.set_cookie("session", max_age=0)

    return res


def get_authorization_response_error(error_type, status_code):
    body = {
        "errorType": get_response_error_string_by_type(error_type)
    }

    return setup_cors_response_headers(Response(json.dumps(body), status=status_code, content_type="application/json"))


permission = {
    "user_service_post": "student",
    "dashboard_service_post": "student",
    "poll_service_post": "student",
    "poll_service_get": "student"
}


def check_permission(token, service):
    session = sessions_storage.get_session(token)
    if not isinstance(session, Session):
        return False
    else:
        user_guid = session.get_user_guid()
        # Database-side validations:
        user = People.objects.filter(guid=user_guid)
        # Check check availability in the database
        if user:
            return False
        else:
            role = user.get_role()
            eligible_role = permission.get(service, None)
            if eligible_role is None:
                return False
            else:
                if eligible_role == role:
                    return True
