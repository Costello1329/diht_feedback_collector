from django.db import models


# Create your models here.
class People(models.Model):
    guid = models.ForeignKey('Guid', related_name='users_to_guid', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, default='student')
    login = models.CharField(max_length=30,null=False)
    password = models.CharField(max_length=16)

    def check_password(self, password):
        return self.password == password


class Guid(models.Model):
    guid = models.IntegerField()
    group = models.CharField(max_length=30)
    active = models.BooleanField(default=False)
