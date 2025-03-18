#from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import CustomUser, Exercise, Submission

# Enregistre tes modèles
admin.site.register(CustomUser)
admin.site.register(Exercise)
admin.site.register(Submission)