from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import People, Guid, Student, Token

admin.site.register(People)
admin.site.register(Guid)
admin.site.register(Student)
admin.site.register(Token)
