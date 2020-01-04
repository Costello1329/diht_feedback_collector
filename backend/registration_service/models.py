from django.db import models


# Create your models here.

class Guid(models.Model):
    guid = models.IntegerField()
    group = models.CharField(max_length=30)
    active = models.BooleanField(default=False)
