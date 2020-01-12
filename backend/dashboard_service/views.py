from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.
from authorization_service.apps import sessions_storage, check_permission
from dashboard_service.apps import get_dashboard_response_success, get_dashboard_response_error, \
    get_dashboard_response_reject
from dashboard_service.models import GroupCourse
from diht_feedback_collector.apps import ResponseErrorType, setup_cors_response_headers
from registration_services.models import People




class UserView(APIView):
    def get(self, request):
        try:
            # Database-side validations:
            try:
                session_guid = request.COOKIES["session"]
            except KeyError:
                session_guid = None

            if session_guid is None:
                return get_dashboard_response_reject(session_guid)

            session = sessions_storage.get_session(session_guid)

            if check_permission(session_guid, "dashboard_service_post"):
                return get_dashboard_response_error(ResponseErrorType.Validation, 403)

            if session is None:
                return get_dashboard_response_reject(session_guid)

            sessions_storage.update_session(session_guid)
            user = People.objects.filter(guid=session.user_guid)
            if user:
                user = user[0]
                group = user.guid.group
                courses = GroupCourse.objects.filter(group=group)
                if courses:
                    dict_courses = dict()
                    for course in courses:
                        dict_courses.update({course.course.title:course.course.guid})
                    return get_dashboard_response_success(dict_courses,session_guid)
                else:
                    get_dashboard_response_error(ResponseErrorType.Validation, 422)
            else:
                # to do поговорить про пользольсзователя который удален из бызы но есть в сесиях
                get_dashboard_response_error(ResponseErrorType.Validation, 400)
        except Exception:
            return get_dashboard_response_error(ResponseErrorType.Internal, 500)

    def options(self, request, *args, **kwargs):
        return setup_cors_response_headers(Response())
