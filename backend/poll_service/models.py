from django.db import models


# Create your models here.
from dashboard_service.models import Course
from registration_services.models import People


class Questionnaire(models.Model):
    guid = models.CharField(max_length=36, unique=True,primary_key=True)
    course = models.ForeignKey('dashboard_service.Course', related_name='questionnaire_to_course', on_delete=models.CASCADE)
    user = models.ForeignKey('registration_services.People', related_name='people_to_course', on_delete=models.CASCADE)
    data = models.CharField(max_length=999,null=True)

    def change_data(self, data):
        self.data = data
        self.save()