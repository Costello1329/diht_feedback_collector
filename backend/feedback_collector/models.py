from django.db import models

# Create your models here.

class Test(models.Model):
    title = models.CharField(max_length=120)
    post = models.TextField()
    date = models.DateTimeField()
    number = models.ImageField()

    def __str__(self):
        return self.title