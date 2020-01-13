from django.contrib import admin

# Register your models here.
from .models import Course, GroupCourse, Teacher, TeacherRole

admin.site.register(Course)
admin.site.register(Teacher)
admin.site.register(GroupCourse)
admin.site.register(TeacherRole)
