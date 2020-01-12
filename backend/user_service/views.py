from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from diht_feedback_collector.apps import setup_cors_response_headers, ResponseErrorType
from registration_services.models import People
from user_service.apps import get_user_response_success, get_user_response_reject, get_user_response_error
from authorization_service.apps import sessions_storage, check_permission


class UserView(APIView):
    def post(self, request):
        try:
            # Database-side validations:
            try:
                session_guid = request.COOKIES["session"]
            except KeyError:
                session_guid = None

            if session_guid is None:
                return get_user_response_reject(session_guid)

            session = sessions_storage.get_session(session_guid)

            if check_permission(session_guid, "user_service_post"):
                get_user_response_error(ResponseErrorType.Validation, 403)

            if session is None:
                return get_user_response_reject(session_guid)

            sessions_storage.update_session(session_guid)
            user = People.objects.filter(guid=session.user_guid)
            if user:
                user = user[0]
                return get_user_response_success(
                    user.login,
                    user.role,
                    session_guid)
            else:
                # to do поговорить про пользольсзователя который удален из бызы но есть в сесиях
                get_user_response_error(ResponseErrorType.Validation, 400)

        except Exception:
            return get_user_response_error(ResponseErrorType.Internal, 500)

    def options(self, request, *args, **kwargs):
        return setup_cors_response_headers(Response())
