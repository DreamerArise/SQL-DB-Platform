# core/permissions.py
from rest_framework.permissions import BasePermission, IsAuthenticated

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and not hasattr(request.user, 'is_teacher') or not request.user.is_teacher

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'is_teacher') and request.user.is_teacher