from datetime import datetime
import re

from django.apps import AppConfig
from rest_framework.response import Response
import json
import redis
from diht_feedback_collector.apps import setup_cors_response_headers, get_response_error_string_by_type
from registration_services.models import People


class AuthorizationServiceConfig(AppConfig):
    name = 'authorization_service'


k_cookie_expiration_time = 2 * 7 * 24 * 60 * 60  # (2 weeks in seconds)


class SessionsStorage:
    sessions: redis.Redis

    def __init__(self):
        self.sessions = redis.Redis(host='127.0.0.1', port=6379, db=0)

    def create_session(self, session_guid, user_guid):
        self.sessions.mset({str(session_guid): str(user_guid)})

    def check_session(self, session_guid):
        if self.sessions.exists(str(session_guid)) == 0:
            return False
        else:
            return True

    def delete_session(self, session_guid):
        self.sessions.delete(str(session_guid))

    def get_user_guid(self, session_guid):
        user_guid = self.sessions.get(str(session_guid)).decode("utf-8")
        return user_guid


class UsersStorage:
    users_storage: redis.Redis

    def __init__(self):
        self.users_storage = redis.Redis(host='127.0.0.1', port=6379, db=1)

    def check_user(self, user_guid):
        if self.users_storage.exists(str(user_guid)) == 0:
            return False
        else:
            return True

    def create_user(self, user_guid: str, session_guid: str):
        self.users_storage.mset({str(user_guid): str(session_guid)})

    def delete_user(self, user_guid: str):
        self.users_storage.delete(str(user_guid))

    def get_session_guid(self, user_guid):
        session_guid = self.sessions.get(str(user_guid)).decode("utf-8")
        return session_guid


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

    res = setup_cors_response_headers(Response(body, status=status, content_type="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value=session_guid, max_age=k_cookie_expiration_time)

    else:
        res.set_cookie("session", max_age=0)

    return res


def get_authorization_response_error(error_type, status_code):
    body = {
        "errorType": get_response_error_string_by_type(error_type)
    }

    return setup_cors_response_headers(Response(body, status=status_code, content_type="application/json"))


permission = {
    "user_service_post": "student",
    "dashboard_service_post": "student",
    "poll_service_post": "student",
    "poll_service_get": "student"
}


def check_permission(token, service):
    user_guid = SessionsStorage().get_user_guid(token, )
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
