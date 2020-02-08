from django.shortcuts import render

# Create your views here.
import uuid

from rest_framework.response import Response
from rest_framework.views import APIView

from authorization_service.apps import SessionsStorage, validate_authorization_contract, \
    get_authorization_response_error, validate_authorization_data, get_authorization_response_success
from diht_feedback_collector.apps import ResponseErrorType, setup_cors_response_headers
from registration_services.models import People

from authorization_service.apps import SessionsStorage, UsersStorage


class UserView(APIView):
    def post(self, request):
        try:
            # Contract validation:
            contract_validation_passed = validate_authorization_contract(request)

            if not contract_validation_passed:
                return get_authorization_response_error(ResponseErrorType.Contract, 400)

            # Contract is observed:
            else:
                user_data = request.data

                # Data validation:
                data_validation_passed = validate_authorization_data(
                    user_data["login"],
                    user_data["password"])

                if not data_validation_passed:
                    return get_authorization_response_error(ResponseErrorType.Validation, 400)

                # Data passed the validation:
                else:
                    # Database-side validations:
                    user = People.objects.filter(login=user_data["login"])
                    # Check check availability in the database
                    if user:
                        does_login_exist = True
                        user = user[0]
                    else:
                        does_login_exist = False
                    is_password_valid = (not does_login_exist) or (user.check_password(user_data["password"]))
                    all_is_valid = \
                        does_login_exist is True \
                        and is_password_valid is True

                    session_guid = None
                    sessions_storage = SessionsStorage()
                    user_storage = UsersStorage()
                    if all_is_valid:
                        if user_storage.check_user(user.guid_id):
                            session_guid = user_storage.get_session_guid(user.guid)
                        else:
                            while True:
                                session_guid = uuid.uuid4().hex
                                if not sessions_storage.check_session(session_guid):
                                    sessions_storage.create_session(session_guid, user.guid)
                                    user_storage.create_user(user.guid, session_guid)
                                    break

                    return get_authorization_response_success(
                        does_login_exist,
                        is_password_valid,
                        session_guid)

        except Exception:
            return get_authorization_response_error(ResponseErrorType.Internal, 500)

    def options(self, request, *args, **kwargs):
        return setup_cors_response_headers(Response(status=204))
