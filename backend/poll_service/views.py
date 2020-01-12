from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from authorization_service.apps import sessions_storage, check_permission
from dashboard_service.models import Course, TeacherRole
from diht_feedback_collector.apps import ResponseErrorType, setup_cors_response_headers

from poll_service.apps import get_pool_response_reject, get_pool_response_error, validate_pool_contract, \
    get_pool_response_success, validate_pool_query_params
from poll_service.models import Questionnaire
from registration_services.models import People
import uuid


class UserView(APIView):
    def post(self, request):
        try:
            # Contract validation:
            contract_validation_passed = validate_pool_contract(request)
            if not contract_validation_passed:
                return get_pool_response_error(ResponseErrorType.Contract, 400)

            try:
                session_guid = request.COOKIES["session"]
            except KeyError:
                session_guid = None

            if session_guid is None:
                return get_pool_response_reject(session_guid)

            session = sessions_storage.get_session(session_guid)

            if check_permission(session_guid, "poll_service_post"):
                get_pool_response_error(ResponseErrorType.Validation, 403)

            if session is None:
                return get_pool_response_reject(session_guid)

            questionnaire_id = request.data["questionnaire_id"]

            user = People.objects.filter(guid=session.user_guid)
            data = request.data["data"]

            questionnaire = Questionnaire.objects.filter(guid=questionnaire_id, user=user)

            if questionnaire:
                questionnaire = questionnaire[0]
                questionnaire.change_data(data)
                body = {
                    "questionnaireSuccess": "True"
                }
                get_pool_response_success(body, 200)
            else:
                get_pool_response_error(ResponseErrorType.Validation, 400)
        except Exception:
            return get_pool_response_error(ResponseErrorType.Internal, 500)

    def get(self, request):
        try:
            params = request.query_params

            if not validate_pool_query_params(params):
                return get_pool_response_error(ResponseErrorType.Contract, 400)

            try:
                session_guid = request.COOKIES["session"]
            except KeyError:
                session_guid = None

            if session_guid is None:
                return get_pool_response_error(ResponseErrorType.Validation, 401)

            session = sessions_storage.get_session(session_guid)

            if session is None:
                return get_pool_response_error(ResponseErrorType.Validation, 401)

            if check_permission(session_guid, "poll_service_get"):
                return get_pool_response_error(ResponseErrorType.Validation, 403)

            sessions_storage.update_session(session_guid)
            course_guid = params["course_guid"]
            user = People.objects.filter(guid=session.user_guid)
            if user:
                user = user[0]
            else:
                return get_pool_response_error(ResponseErrorType.Validation, 401)

            course = Course.objects.filter(guid=course_guid)
            if course:
                course = course[0]
                questionnaire = Questionnaire.objects.filter(course=course, user=user)

                if questionnaire:
                    questionnaire = questionnaire[0]
                    body = {
                        "guid": questionnaire.guid,
                        "data": questionnaire.data
                    }
                    return get_pool_response_success(body, session_guid)
                else:
                    group = user.guid.group
                    teacher_role = TeacherRole.objects.filter(group=group, course=course)
                    list_teacher = dict()
                    for teachers in teacher_role:
                        list_teacher.update({teachers.teacher.full_name: teachers.role})
                    while True:
                        guid = uuid.uuid4().hex
                        if not Questionnaire.objects.filter(guid=guid):
                            questionnaire = Questionnaire.objects.create(guid=guid, course=course, user=user)
                            body = {
                                "guid": questionnaire.guid,
                                "data": questionnaire.data,
                                "teacher": list_teacher
                            }
                            return get_pool_response_success(body, session_guid)

            else:
                return get_pool_response_error(ResponseErrorType.Validation, 400)
        except Exception:
            return get_pool_response_error(ResponseErrorType.Internal, 500)

    def options(self, request, *args, **kwargs):
        return setup_cors_response_headers(Response())
