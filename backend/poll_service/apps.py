import json
import re

from django.apps import AppConfig
from rest_framework.response import Response

from authorization_service.apps import k_cookie_expiration_time
from diht_feedback_collector.apps import setup_cors_response_headers, get_response_error_string_by_type


class PollServiceConfig(AppConfig):
    name = 'poll_service'


def get_pool_response_success(body, session_guid):
    res = setup_cors_response_headers(Response(json.dumps(body), status=200, content_type="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value=session_guid, max_age=k_cookie_expiration_time)

    return res


def get_pool_response_reject(session_guid):
    res = setup_cors_response_headers(Response(status=401, content_type="application/json"))

    if session_guid is not None:
        res.set_cookie("session", value="", expires=0)

    return res


def get_pool_response_error(error_type, status_code):
    body = {
        "errorType": get_response_error_string_by_type(error_type)
    }

    return setup_cors_response_headers(Response(json.dumps(body), status=status_code, content_type="application/json"))


def validate_pool_contract(req):
    try:
        user_data = req.data
        if re.match("application/json", req.headers["Content-Type"]) is None:
            return False

        if len(user_data.keys()) != 2:
            return False

        all_needed_keys_exist = \
            "questionnaire_id" in user_data.keys() and "data" in user_data.keys()

        all_types_valid = \
            isinstance(user_data["questionnaire_id"], str) and isinstance(user_data["data"], str)

        return all_needed_keys_exist and all_types_valid

    except Exception:
        return False


def validate_pool_query_params(params):
    try:
        if len(params) != 1:
            return False

        all_needed_params_exist = "course_guid" in params.keys()

        if all_needed_params_exist:
            return True
    except Exception:
        return False
