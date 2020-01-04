from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from .apps import validate_registration_contract
from .models import Guid


class UserView(APIView):
    def post(self, request):
        try:
            # Contract validation:
            contract_validation_passed = validate_registration_contract(request)
            guid = Guid.objects.all()
            return Response({"Guid": guid})
            if not contract_validation_passed:
                return get_registration_response_error(ResponseErrorType.Contract, 400)
            # Contract is observed:
            else:
                user_data = request.get_json()

                # Data validation:
                data_validation_passed = validate_authorization_data(
                    user_data["login"],
                    user_data["password"])

                if not data_validation_passed:
                    return get_authorization_response_error(ResponseErrorType.Validation, 400)

                # Data passed the validation:
                else:
                    # Database-side validations:
                    user = Users.query.filter_by(login=user_data["login"]).first()
                    does_login_exist = user is not None
                    is_password_valid = (not does_login_exist) or (user.check_password(user_data["password"]))
                    all_is_valid = \
                        does_login_exist is True \
                        and is_password_valid is True

                    session_guid = None

                    if all_is_valid:
                        session_guid = uuid.uuid4().hex
                        global sessions_storage
                        sessions_storage.create_session(user.guid, session_guid)

                    return get_authorization_response_success(
                        does_login_exist,
                        is_password_valid,
                        session_guid)
        except Exception:
            return get_registration_response_error(ResponseErrorType.Internal, 500)
