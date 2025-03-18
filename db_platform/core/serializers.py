from rest_framework import serializers
from .models import Exercise, Submission, CustomUser  # Assure-toi que CustomUser est importé

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']  # Ajuste les champs selon tes besoins

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'title', 'file']

class SubmissionSerializer(serializers.ModelSerializer):
    student = UserSerializer()  # Utilise un sérialiseur imbriqué pour l'étudiant
    exercise = serializers.SlugRelatedField(slug_field='title', read_only=True)  # Garde slug pour exercise si voulu

    class Meta:
        model = Submission
        fields = ['id', 'student', 'exercise', 'file', 'submitted_at', 'score', 'feedback', 'is_locked']