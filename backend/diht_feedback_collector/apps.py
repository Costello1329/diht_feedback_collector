from enum import Enum

from django.apps import AppConfig


class DihtFeedbackCollectorConfig(AppConfig):
    name = 'diht_feedback_collector'


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
    res["Access-Control-Allow-Origin"] = "http://127.0.0.1:1329"
    res["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    res["Access-Control-Allow-Headers"] = \
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    res["Access-Control-Allow-Credentials"] = "true"
    return res





