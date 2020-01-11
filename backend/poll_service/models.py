from django.db import models


# Create your models here.


class Questionnaire:
    guid = models.CharField(max_length=36, unique=True)
    course = models.ForeignKey('Course', related_name='questionnaire_to_course', on_delete=models.DO_NOTHING)
    user = models.ForeignKey('People', related_name='people_to_course', on_delete=models.DO_NOTHING)
    data = models.CharField(max_length=999)

    def change_data(self, data):
        self.data = data
        self.save()