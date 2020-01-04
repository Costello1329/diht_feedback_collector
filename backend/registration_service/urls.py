from django.urls import path
from .views import UserView
app_name = "register_service"
# app_name will help us do a reverse look-up latter.
urlpatterns = [
    path('reg/', UserView.as_view()),
    ]
