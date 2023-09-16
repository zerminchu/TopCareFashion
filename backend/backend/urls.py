from django.contrib import admin
from django.urls import path, include, re_path

from app import views
from app import sellerViews

from app.views import *
from app.sellerViews import *


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # General
    path("register/", views.signUp, name="register"),
    path("sign-in/", views.signIn, name="login"),
    path("sign-up/", views.signUp, name="sign-up"),
    path("recover-password/", views.recoverPassword, name="recover-password"),
    path("verify-id-token/", views.verifyIdToken, name="verify-id-token"),
    path("retrieve-user-info-from-token/", views.retrieveUserInfoFromToken,
         name="retrieve-user-info-from-token"),
    path("update-profile/", views.updateProfile, name="update-profile"),
    path("listing/advertisement", views.getAdvertisementListing, name="get-listing-advertisement"),
    path("listing/<str:item_id>", views.getListingDetailByItemId, name="get-listing-by-item-id"),

    path("view-item/all/", views.get_by_sellerId, name="view-item/all"),
    path("view-item/<str:user_id>/",
         views.get_by_sellerId, name="view-item/user_id"),
    path("item/", views.getAllItems, name="get-all-item"),

    # Seller
    
    path("add-product/", views.add_product, name="add-product"),
    path("classify-image/", views.classify_image, name="classify-image"),
    path("seller/onboarding/", sellerViews.onBoarding, name="onboarding"),
    path("seller/check-onboarding/", sellerViews.checkOnBoardingCompleted, name="check-onboarding"),
    path("seller/reply-review/", sellerViews.replyReview, name="reply-review"),
    path("seller/<str:user_id>/", sellerViews.getSellerProfile, name="get-seller-profile"),
    path("seller/<str:user_id>/update-business-profile/", sellerViews.updateBusinessProfile, name="update-business-profile"),
    path("feedback/<str:user_id>/feedback-form/", views.feedbackForm, name="feedback-form"),
    path("seller/<str:user_id>/ratings/", sellerViews.getReviews, name="get-seller-reviews"),
    
]
