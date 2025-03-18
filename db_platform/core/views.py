from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Submission, CustomUser, Exercise
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
import magic
from .utils import extract_text_from_pdf, evaluate_with_deepseek
from django.db.models import Avg
from .serializers import SubmissionSerializer

User = get_user_model()

class RegisterUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        is_teacher = request.data.get('is_teacher', False)

        if not username or not password or not email:
            return Response({'error': 'Username, password, et email sont requis'}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 8:
            return Response({'error': 'Le mot de passe doit contenir au moins 8 caractères'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Ce nom d’utilisateur existe déjà'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Cet email existe déjà'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_teacher=is_teacher
        )
        return Response({'message': 'Utilisateur créé avec succès', 'id': user.id}, status=status.HTTP_201_CREATED)

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.is_teacher

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return not request.user.is_teacher

class ExerciseList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Filtrer les exercices en fonction du rôle de l'utilisateur
        if request.user.is_teacher:
            exercises = Exercise.objects.filter(teacher=request.user)  # Uniquement les exercices de l'enseignant connecté
        else:
            exercises = Exercise.objects.all()  # Les étudiants voient tous les exercices disponibles
        base_url = request.build_absolute_uri('/')[:-1]  # URL de base (ex. http://localhost:8000)
        data = [
            {
                'id': e.id,
                'title': e.title,
                'file': f"{base_url}{e.file.url}" if e.file else None,
                'correction_models': f"{base_url}{e.correction_models.url}" if request.user.is_teacher and e.correction_models and e.correction_models.url else None
            }
            for e in exercises
        ]
        return Response(data)

class SubmissionCreate(APIView):
    permission_classes = [IsStudent]

    def post(self, request, *args, **kwargs):
        exercise_id = request.data.get('exercise')
        file = request.FILES.get('file')

        if not exercise_id or not file:
            return Response({'error': 'Exercice et fichier requis.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exercise = Exercise.objects.get(id=exercise_id)
        except Exercise.DoesNotExist:
            return Response({'error': 'Exercice non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

        mime = magic.Magic(mime=True)
        file_type = mime.from_buffer(file.read(1024))
        file.seek(0)

        if file_type != 'application/pdf':
            return Response({'error': 'Le fichier doit être un PDF.'}, status=status.HTTP_400_BAD_REQUEST)

        submission = Submission.objects.create(
            student=request.user,
            exercise=exercise,
            file=file
        )

        if exercise.correction_models:
            submission_file_path = submission.file.path
            correction_file_path = exercise.correction_models.path

            submission_text = extract_text_from_pdf(submission_file_path)
            correction_text = extract_text_from_pdf(correction_file_path)

            if "Erreur" not in submission_text and "Erreur" not in correction_text:
                score, feedback = evaluate_with_deepseek(submission_text, correction_text)
                submission.score = score if score > 0 else None  # Garde null si score est 0
                submission.feedback = feedback if feedback else "Aucun feedback disponible."
            else:
                submission.score = None
                submission.feedback = f"Erreur lors de la correction : {submission_text} ou {correction_text}"
            submission.save()

        return Response({
            'id': submission.id,
            'exercise': exercise.id,
            'file': submission.file.url,
            'submitted_at': submission.submitted_at.isoformat(),
            'score': submission.score,
            'feedback': submission.feedback
        }, status=status.HTTP_201_CREATED)
    
class ExerciseCreate(APIView):
    permission_classes = [IsTeacher]

    def post(self, request, *args, **kwargs):
        title = request.data.get('title')
        file = request.FILES.get('file')
        correction_models = request.FILES.get('correction_models')

        if not title or not file:
            return Response({'error': 'Titre et fichier sont requis'}, status=status.HTTP_400_BAD_REQUEST)

        mime = magic.Magic(mime=True)
        file_type = mime.from_buffer(file.read(1024))
        file.seek(0)
        if file_type != 'application/pdf':
            return Response({'error': 'Seuls les fichiers PDF sont acceptés pour l\'exercice'}, status=status.HTTP_400_BAD_REQUEST)

        if correction_models:
            correction_type = mime.from_buffer(correction_models.read(1024))
            correction_models.seek(0)
            if correction_type != 'application/pdf':
                return Response({'error': 'Seuls les fichiers PDF sont acceptés pour la correction'}, status=status.HTTP_400_BAD_REQUEST)

        if file.size > 10 * 1024 * 1024:
            return Response({'error': 'Le fichier est trop volumineux (max 10MB)'}, status=status.HTTP_400_BAD_REQUEST)
        if correction_models and correction_models.size > 10 * 1024 * 1024:
            return Response({'error': 'Le fichier de correction est trop volumineux (max 10MB)'}, status=status.HTTP_400_BAD_REQUEST)

        exercise = Exercise.objects.create(
            title=title,
            teacher=request.user,
            file=file,
            correction_models=correction_models
        )
        return Response({'message': 'Exercice ajouté avec succès', 'id': exercise.id}, status=status.HTTP_201_CREATED)
    
class SubmissionList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        base_url = request.build_absolute_uri('/')[:-1]
        if request.user.is_teacher:
            # Exclure les soumissions des enseignants et précharger les exercices
            submissions = Submission.objects.exclude(student__is_teacher=True).select_related('exercise')
            data = [
                {
                    'id': s.id,
                    'exercise_title': s.exercise.title if s.exercise else "Exercice non spécifié",
                    'student_username': s.student.username,
                    'file': f"{base_url}{s.file.url}" if s.file else None,
                    'submitted_at': s.submitted_at.isoformat(),
                    'score': s.score,
                    'feedback': s.feedback
                }
                for s in submissions
            ]
        else:
            # Précharger les exercices pour les étudiants
            submissions = Submission.objects.filter(student=request.user).select_related('exercise')
            data = [
                {
                    'id': s.id,
                    'exercise_title': s.exercise.title if s.exercise else "Exercice non spécifié",
                    'file': f"{base_url}{s.file.url}" if s.file else None,
                    'submitted_at': s.submitted_at.isoformat(),
                    'score': s.score,
                    'feedback': s.feedback
                }
                for s in submissions
            ]
        return Response(data)
    
class TeacherExerciseList(APIView):
    permission_classes = [IsTeacher]

    def get(self, request, *args, **kwargs):
        exercises = Exercise.objects.filter(teacher=request.user)
        base_url = request.build_absolute_uri('/')[:-1]
        data = [
            {
                'id': e.id,
                'title': e.title,
                'file': f"{base_url}{e.file.url}" if e.file else None,
                'correction_models': f"{base_url}{e.correction_models.url}" if e.correction_models and e.correction_models.url else None,
                'created_at': e.created_at.isoformat()
            }
            for e in exercises
        ]
        return Response(data)
    
class EditSubmissionView(APIView):
    def put(self, request, pk):
        try:
            submission = Submission.objects.get(pk=pk, student=request.user)
            if submission.is_locked:
                return Response({"error": "Cette soumission est verrouillée et ne peut pas être modifiée."}, status=status.HTTP_403_FORBIDDEN)
            serializer = SubmissionSerializer(submission, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Submission.DoesNotExist:
            return Response({"error": "Soumission non trouvée ou accès non autorisé."}, status=status.HTTP_404_NOT_FOUND)  

class TeacherSubmissionsView(APIView):
    def get(self, request, exercise_id):
        if not request.user.groups.filter(name='teachers').exists():
            return Response({"error": "Accès réservé aux enseignants."}, status=status.HTTP_403_FORBIDDEN)
        submissions = Submission.objects.filter(exercise_id=exercise_id).select_related('student')
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 

class AdjustSubmissionView(APIView):
    def post(self, request, pk):
        if not request.user.groups.filter(name='teachers').exists():
            return Response({"error": "Accès réservé aux enseignants."}, status=status.HTTP_403_FORBIDDEN)
        try:
            submission = Submission.objects.get(pk=pk)
            submission.score = request.data.get('score', submission.score)
            submission.feedback = request.data.get('feedback', submission.feedback)
            submission.is_locked = True  # Verrouiller après ajustement
            submission.save()
            return Response({"message": "Note et feedback mis à jour."}, status=status.HTTP_200_OK)
        except Submission.DoesNotExist:
            return Response({"error": "Soumission non trouvée."}, status=status.HTTP_404_NOT_FOUND) 

from .models import Exercise
from .serializers import ExerciseSerializer

class EditExerciseView(APIView):
    def put(self, request, pk):
        if not request.user.groups.filter(name='teachers').exists():
            return Response({"error": "Accès réservé aux enseignants."}, status=status.HTTP_403_FORBIDDEN)
        try:
            exercise = Exercise.objects.get(pk=pk)
            serializer = ExerciseSerializer(exercise, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exercise.DoesNotExist:
            return Response({"error": "Exercice non trouvé."}, status=status.HTTP_404_NOT_FOUND)                   
    
class UserInfo(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'is_teacher': user.is_teacher
        })
    

class ExerciseDetail(APIView):
    permission_classes = [IsTeacher]

    def get(self, request, pk, *args, **kwargs):
        try:
            exercise = Exercise.objects.get(id=pk, teacher=request.user)
            serializer = ExerciseSerializer(exercise)
            return Response(serializer.data)
        except Exercise.DoesNotExist:
            return Response({"error": "Exercice non trouvé ou accès non autorisé."}, status=status.HTTP_404_NOT_FOUND)    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exercise_submissions(request, exercise_id):
    if not request.user.groups.filter(name='teachers').exists():
        return Response({"error": "Accès réservé aux enseignants."}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        exercise = Exercise.objects.get(id=exercise_id)
        submissions = Submission.objects.filter(exercise=exercise)
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)
    except Exercise.DoesNotExist:
        return Response({"error": "Exercice non trouvé"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_performance(request):
    print("Appel de student_performance pour", request.user)
    submissions = Submission.objects.filter(student=request.user).order_by('-submitted_at')
    serializer = SubmissionSerializer(submissions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_statistics(request):
    print("Appel de teacher_statistics pour", request.user)
    exercises = Exercise.objects.all()
    stats = {}
    for exercise in exercises:
        submissions = Submission.objects.filter(exercise=exercise)
        avg_score = submissions.aggregate(Avg('score'))['score__avg'] or 0
        stats[exercise.id] = {
            'average_score': avg_score,
            'submission_count': submissions.count()
        }
    return Response(stats)