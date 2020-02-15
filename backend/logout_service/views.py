from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from diht_feedback_collector.apps import setup_cors_response_headers, ResponseErrorType
from logout_service.apps import get_logout_response_success
from user_service.apps import get_user_response_error


class UserView(APIView):
    def get(self, request):
        try:
            return get_logout_response_success()
        except Exception:
            return get_user_response_error(ResponseErrorType.Internal, 500)

    def options(self, request, *args, **kwargs):
        return setup_cors_response_headers(Response(status=204))
