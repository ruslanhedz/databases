from django.urls import path
from .views import AddAnimalAPIView, CreateAdoptionRequestView, AvailableAnimalsView, MyAnimalsView, \
    AdoptionRequestsView, MyAdoptionRequestsView, ApproveAdoptionView, RejectAdoptionView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    #path('api/upload-photo/', UploadPhotoAPIView.as_view(), name='upload-photo'),
    path('api/add-animal/', AddAnimalAPIView.as_view(), name='add-animal'),
    path('api/adoption-request/', CreateAdoptionRequestView.as_view(), name='create-adoption-request'),
    path('api/animals/available/', AvailableAnimalsView.as_view(), name='available-animals'),
    path('api/animals/my/', MyAnimalsView.as_view(), name='my-animals'),
    path('api/adoption-requests/', AdoptionRequestsView.as_view(), name='create-adoption-requests'),
    path('api/adoption-requests/my/', MyAdoptionRequestsView.as_view(), name='my-adoption-requests'),
    path('api/adoption-requests/approve/', ApproveAdoptionView.as_view(), name='approve-adoption'),
    path('api/adoption-requests/reject/', RejectAdoptionView.as_view(), name='reject-adoption'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
