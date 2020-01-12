import json

from django.apps import AppConfig
from rest_framework.response import Response

from diht_feedback_collector.apps import setup_cors_response_headers, get_response_error_string_by_type


class LogoutServiceConfig(AppConfig):
    name = 'logout_service'

def get_logout_response_success(session_guid):
    res = setup_cors_response_headers(Response("", status=200))

    if session_guid is not None:
        res.set_cookie("session", value=session_guid, max_age=0)

    return res

def get_logout_response_error(error_type, status_code):
    body = {
        "errorType": get_response_error_string_by_type(error_type)
    }

    return setup_cors_response_headers(Response(body, status=status_code, content_type="application/json"))
