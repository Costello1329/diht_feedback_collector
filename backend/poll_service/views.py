from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from authorization_service.apps import SessionsStorage, check_permission
from dashboard_service.models import Course, TeacherRole
from diht_feedback_collector.apps import ResponseErrorType, setup_cors_response_headers

from poll_service.apps import get_poll_response_reject, get_poll_response_error, validate_poll_contract, \
    get_poll_response_success, validate_poll_query_params
from poll_service.models import Questionnaire
from registration_services.models import People
import uuid


class UserView(APIView):
    def post(self, request):
        try:
            # Contract validation:
            contract_validation_passed = validate_poll_contract(request)
            if not contract_validation_passed:
                return get_poll_response_error(ResponseErrorType.Contract, 400)

            try:
                session_guid = request.COOKIES["session"]
            except KeyError:
                session_guid = None

            if session_guid is None:
                return get_poll_response_reject(session_guid)

            sessions_storage = SessionsStorage()

            if not sessions_storage.check_session(session_guid):
                return get_poll_response_reject(session_guid)

            if check_permission(session_guid, "poll_service_post"):
                get_poll_response_error(ResponseErrorType.Validation, 403)

            questionnaire_id = request.data["questionnaire_id"]

            data = request.data["data"]

            questionnaire = Questionnaire.objects.filter(guid=questionnaire_id)

            if questionnaire:
                questionnaire = questionnaire[0]
                questionnaire.change_data(data)
                body = {
                    "questionnaireSuccess": "True"
                }
                return get_poll_response_success(body, session_guid)
            else:
                return get_poll_response_error(ResponseErrorType.Validation, 400)
        except Exception:
            return get_poll_response_error(ResponseErrorType.Internal, 500)

    def get(self, request):
        try:
            params = request.query_params

            if not validate_poll_query_params(params):
                return get_poll_response_error(ResponseErrorType.Contract, 400)

            try:
                session_guid = request.COOKIES["session"]
            except KeyError:
                session_guid = None

            if session_guid is None:
                return get_poll_response_error(ResponseErrorType.Validation, 401)

            session_storage = SessionsStorage()
            if not session_storage.check_session(session_guid):
                return get_poll_response_error(ResponseErrorType.Validation, 401)

            if check_permission(session_guid, "poll_service_get"):
                return get_poll_response_error(ResponseErrorType.Validation, 403)

            course_guid = params["course_guid"]
            user = People.objects.filter(guid=session_storage.get_user_guid(session_guid))
            if user:
                user = user[0]
            else:
                return get_poll_response_error(ResponseErrorType.Validation, 401)

            course = Course.objects.filter(guid=course_guid)
            if course:
                group = user.guid.group
                teacher_role = TeacherRole.objects.filter(group=group, course=course)
                list_teacher = dict()
                for teachers in teacher_role:
                    list_teacher.update({teachers.teacher.full_name: teachers.role})
                course = course[0]
                questionnaire = Questionnaire.objects.filter(course=course, user=user)

                if questionnaire:
                    questionnaire = questionnaire[0]
                    body = {
                        "guid": questionnaire.guid,
                        "data": questionnaire.data,
                        "teachers": list_teacher
                    }
                    return get_poll_response_success(body, session_guid)
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
                                "teachers": list_teacher
                            }
                            return get_poll_response_success(body, session_guid)

            else:
                return get_poll_response_error(ResponseErrorType.Validation, 400)
        except Exception:
            return get_poll_response_error(ResponseErrorType.Internal, 500)

    def options(self, request, *args, **kwargs):
        return setup_cors_response_headers(Response(status=204))
