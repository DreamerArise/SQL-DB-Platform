# core/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    is_teacher = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class Exercise(models.Model):
    title = models.CharField(max_length=200)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='exercises')
    file = models.FileField(upload_to='exercises/', null=True, blank=True)
    correction_models = models.FileField(upload_to='corrections/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Submission(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='submissions')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='submissions')
    file = models.FileField(upload_to='submissions/', default='default_file.txt')
    submitted_at = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    is_locked = models.BooleanField(default=False)

    def __str__(self):
        return f"Soumission de {self.student.username} pour {self.exercise.title}"