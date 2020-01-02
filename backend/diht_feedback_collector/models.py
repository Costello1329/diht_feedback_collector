from django.db import models


# Create your models here.
class Guid(models.Model):
    guid = models.IntegerField()
    group = models.CharField(max_length=30)
    active = models.BooleanField(default=False)


class People(models.Model):
    guid = models.ForeignKey('Guid', related_name='users_to_guid', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, default='student')
    login = models.CharField(max_length=30, null=False)
    password = models.CharField(max_length=16)

    def check_password(self, password):
        return self.password == password


class Student(models.Model):
    email = models.EmailField()
    first_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    middle_name = models.CharField(max_length=40)
    group = models.CharField(max_length=30)


class Token(models.Model):
    token = models.CharField(unique=True, primary_key=True,max_length=20)
    people = models.ForeignKey('People', related_name='people_to_guid', on_delete=models.DO_NOTHING)
    date = models.DateField()
