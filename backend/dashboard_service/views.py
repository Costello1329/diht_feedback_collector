from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.
from authorization_service.apps import sessions_storage
from diht_feedback_collector.apps import check_permission, ResponseErrorType
from registration_service.models import People
from user_service.apps import get_user_response_reject, get_user_response_error


class UserView(APIView):
    def get(self, request):
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

            else:
    # to do поговорить про пользольсзователя который удален из бызы но есть в сесиях
                get_user_response_error(ResponseErrorType.Validation, 400)
        except Exception:
            return get_user_response_error(ResponseErrorType.Internal, 500)