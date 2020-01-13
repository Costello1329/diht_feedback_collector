from django.db import models


class Student(models.Model):
    email = models.EmailField()
    first_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    middle_name = models.CharField(max_length=40)
    group = models.CharField(max_length=30)
