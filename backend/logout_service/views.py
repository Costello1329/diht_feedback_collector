from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from authorization_service.apps import sessions_storage
from diht_feedback_collector.apps import setup_cors_response_headers, ResponseErrorType
from logout_service.apps import get_logout_response_success
from user_service.apps import get_user_response_error


class UserView(APIView):
    def post(self, request):
        try:
            # Database-side validations:
            session_guid = request.COOKIES["session"]

            if session_guid is not None:
                sessions_storage
                if sessions_storage.get_session is not None:
                    sessions_storage.delete_session(session_guid)

            return get_logout_response_success(session_guid)

        except Exception:
            return get_user_response_error(ResponseErrorType.Internal, 500)

    def options(self, request, *args, **kwargs):
        return setup_cors_response_headers(Response())
