from django.urls import path, include
from .views import LogOutView, RegisterView, activate_account, MyTokenObtainPairView, UserProfileView

urlpatterns = [
    #path('signup/', SignUpView.as_view(), name='signup'),
    #path('activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate'),
    path('auth/', include('django.contrib.auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('activate/<int:uid>/<str:token>/', activate_account, name="activate-account"),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),

    #path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogOutView.as_view(), name='logout'),
]
