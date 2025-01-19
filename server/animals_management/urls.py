from django.urls import path
from .views import AddAnimalView, CreateAdoptionRequestView, AvailableAnimalsView, MyAnimalsView, AdoptionRequestsView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/add-animal/', AddAnimalView.as_view(), name='add-animal'),
    path('api/adoption-request/', CreateAdoptionRequestView.as_view(), name='create-adoption-request'),
    path('api/animals/available/', AvailableAnimalsView.as_view(), name='available-animals'),
    path('api/animals/my', MyAnimalsView.as_view(), name='my-animals'),
    path('api/adoption-requests/', AdoptionRequestsView.as_view(), name='create-adoption-requests'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
