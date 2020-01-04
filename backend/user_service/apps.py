from django.apps import AppConfig
from rest_framework.response import Response
import json

from authorization_service.apps import k_cookie_expiration_time
from diht_feedback_collector.apps import setup_cors_response_headers, get_response_error_string_by_type


class UserServiceConfig(AppConfig):
    name = 'user_service'


def get_user_response_success(login, role, session_guid):
    body = {
        "login": login,
        "role": role
    }

    res = setup_cors_response_headers(Response(json.dumps(body), status=200, content_type="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value=session_guid, max_age=k_cookie_expiration_time)

    return res


def get_user_response_reject(session_guid):
    res = setup_cors_response_headers(Response(status=401, content_type="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value="", expires=0)

    return res


def get_user_response_error(error_type, status_code):
    body = {
        "errorType": get_response_error_string_by_type(error_type)
    }

    return setup_cors_response_headers(Response(json.dumps(body), status=status_code, content_type="application/json"))
