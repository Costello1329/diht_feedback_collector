import uuid

from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from authorization_service.apps import validate_authorization_data, get_authorization_response_error, \
    get_authorization_response_success, SessionsStorage
from diht_feedback_collector.apps import ResponseErrorType
from .apps import validate_registration_contract, get_registration_response_success, get_registration_response_error, \
    validate_registration_data
from .models import Guid, People

sessions_storage = SessionsStorage()


class UserView(APIView):
    def post(self, request):
        try:
            # Contract validation:
            contract_validation_passed = validate_registration_contract(request)

            if not contract_validation_passed:
                return get_registration_response_error(ResponseErrorType.Contract, 400)

            # Contract is observed:
            else:
                user_data = request.data

                # Data validation:
                data_validation_passed = validate_registration_data(
                    user_data["token"],
                    user_data["login"],
                    user_data["password"],
                    user_data["confirmation"])

                if not data_validation_passed:
                    return get_registration_response_error(ResponseErrorType.Validation, 400)

                # Data passed the validation:
                else:
                    # Database-side validations:
                    guid = Guid.objects.filter(guid=user_data["token"])
                    # Check check availability in the database
                    if guid:
                        guid = Guid.objects.get(guid=user_data["token"])
                        does_token_exist = True
                    else:
                        does_token_exist = False
                    is_token_unactivated = (not does_token_exist) or (not guid.active)
                    people = People.objects.filter(login=user_data['login'])
                    # Check check availability in the database
                    if people:
                        is_login_unique = False
                    else:
                        is_login_unique = True
                    all_is_valid = \
                        does_token_exist is True \
                        and is_token_unactivated is True \
                        and is_login_unique is True

                    if all_is_valid:
                        user = People.objects.create(login=user_data["login"], password=user_data["password"],
                                                     guid=guid)
                        guid.set_active()
                        user.save()

                    return get_registration_response_success(
                        does_token_exist,
                        is_token_unactivated,
                        is_login_unique)

        except Exception:
            return get_registration_response_error(ResponseErrorType.Internal, 500)
