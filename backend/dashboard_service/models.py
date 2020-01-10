from django.db import models


# Create your models here.

class Course(models.Model):
    guid = models.CharField(max_length=36, unique=True)
    title = models.CharField(max_length=80)


class Teacher(models.Model):
    guid = models.CharField(max_length=36, unique=True)
    full_name = models.CharField(max_length=100)


class GroupCurse:
    course = models.ForeignKey('Course', related_name='group_to_course', on_delete=models.DO_NOTHING)
    group = models.CharField(max_length=30)


# TeacherRole(Group)
class TeacherRole:
    teacher = models.ForeignKey('Course', related_name='group_to_course', on_delete=models.DO_NOTHING)
    role = models.CharField(max_length=30)
    group = models.CharField(max_length=30)

