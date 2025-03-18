from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.views import (
    ExerciseList,
    SubmissionCreate,
    RegisterUser,
    UserInfo,
    ExerciseCreate,
    SubmissionList,
    TeacherExerciseList,
    EditSubmissionView,
    TeacherSubmissionsView,
    AdjustSubmissionView,
    EditExerciseView,
    student_performance,
    teacher_statistics,
    ExerciseDetail,
    #class_average,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/exercises/', ExerciseList.as_view(), name='exercise-list'),
    path('api/exercises/add/', ExerciseCreate.as_view(), name='exercise-create'),
    path('api/submit/', SubmissionCreate.as_view(), name='submission-create'),
    path('api/submissions/', SubmissionList.as_view(), name='submission_list'),
    path('api/student-performance/', student_performance, name='student_performance'),
    path('api/teacher-statistics/', teacher_statistics, name='teacher_statistics'),
    path('api/submissions/<int:pk>/edit/', EditSubmissionView.as_view(), name='edit-submission'),
    path('api/exercises/<int:exercise_id>/submissions/', TeacherSubmissionsView.as_view(), name='teacher-submissions'),
    path('api/submissions/<int:pk>/adjust/', AdjustSubmissionView.as_view(), name='adjust-submission'),
    path('api/exercises/<int:pk>/edit/', EditExerciseView.as_view(), name='edit-exercise'),
    path('api/teacher-exercises/', TeacherExerciseList.as_view(), name='teacher_exercise_list'),
    path('api/register/', RegisterUser.as_view(), name='register-user'),
    path('api/user/', UserInfo.as_view(), name='user-info'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/exercises/<int:pk>/', ExerciseDetail.as_view(), name='exercise-detail'),
    #path('api/class-average/', class_average, name='class_average'),
    path('accounts/', include('allauth.urls')),
]

# Déplacer le code des URLs statiques ici
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Affichage des URLs chargées (pour débogage)
print("Chargement des URLs:", urlpatterns)