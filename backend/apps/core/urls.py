from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from apps.core import views

router = DefaultRouter()
router.register('goals', views.GoalViewSet, basename='goal')
router.register('tasks', views.TaskViewSet, basename='task')
router.register('content', views.ContentItemViewSet, basename='content')
router.register('personas', views.PersonaViewSet, basename='persona')
router.register('brand-memory/documents', views.BrandDocumentViewSet, basename='brand-document')

urlpatterns = [
    # NOTE: specific paths must come BEFORE include(router.urls), otherwise the
    # router's goals/<pk>/ detail pattern would swallow 'goals/generate/'.
    path('goals/generate/', views.generate_plan, name='generate-plan'),
    path('brand-memory/voice/', views.brand_voice, name='brand-voice'),
    path('brand-memory/query/', views.brand_query, name='brand-query'),
    path('auth/register/', views.register, name='register'),
    path('auth/token/', obtain_auth_token, name='login'),
    path('', include(router.urls)),
    path('brand-memory/voice/', views.brand_voice, name='brand-voice'),
    path('brand-memory/query/', views.brand_query, name='brand-query'),
    path('auth/register/', views.register, name='register'),
    path('auth/token/', obtain_auth_token, name='login'),
]
