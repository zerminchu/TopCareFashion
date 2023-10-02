from app import buyerViews, sellerViews, views
from app.buyerViews import *
from app.sellerViews import *
from app.views import *
from django.contrib import admin
from django.urls import include, path, re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path("add-product/", views.add_product, name="add-product"),
    path("view-item/all/", views.get_all_item, name="view-item/all"),
    path("view-item/<str:user_id>/",
         views.get_by_sellerId, name="view-item/user_id"),
    path("view-item/<str:user_id>/<str:item_id>/",
         views.get_seller_and_item, name="view-item/user_id/item_id"),
    path("edit-item/<str:user_id>/<str:item_id>/",
         views.edit_item, name="edit-item/user_id/item_id"),
    path("delete-item/<str:user_id>/<str:item_id>/",
         views.delete_item, name="delete-item/user_id/item_id"),


    # Generals
    path("register/", views.signUp, name="register"),
    path("sign-in/", views.signIn, name="login"),
    path("sign-up/", views.signUp, name="sign-up"),
    path("recover-password/", views.recoverPassword, name="recover-password"),
    path("verify-id-token/", views.verifyIdToken, name="verify-id-token"),
    path("retrieve-user-info-from-token/", views.retrieveUserInfoFromToken,
         name="retrieve-user-info-from-token"),
    path("update-profile/", views.updateProfile, name="update-profile"),
    path("listing/advertisement", views.getAdvertisementListing,
         name="get-listing-advertisement"),
    path("listing/<str:item_id>", views.getListingDetailByItemId,
         name="get-listing-by-item-id"),


    path("item/", views.getAllItems, name="get-all-item"),
    path("user/", views.getAllUsers, name="get-all-user"),
    path("user/<str:user_id>", views.getUserById, name="get-user-by-id"),


    # Seller
    path("add-product/", views.add_product, name="add-product"),
    path("classify-image/", views.classify_image, name="classify-image"),
    path("seller/onboarding/", sellerViews.onBoarding, name="onboarding"),
    path("seller/check-onboarding/",
         sellerViews.checkOnBoardingCompleted, name="check-onboarding"),
    path("seller/reply-review/", sellerViews.replyReview, name="reply-review"),
    path("seller/<str:user_id>/", sellerViews.getSellerProfile,
         name="get-seller-profile"),
    path("seller/<str:user_id>/update-business-profile/",
         sellerViews.updateBusinessProfile, name="update-business-profile"),
    path("feedback/<str:user_id>/feedback-form/",
         views.feedbackForm, name="feedback-form"),
    path("seller/<str:user_id>/ratings/",
         sellerViews.getReviews, name="get-seller-reviews"),



    # Buyer
    path("buyer/checkout/", buyerViews.getCheckoutLink, name="get-checkout-link"),
    path("buyer/premium-feature-checkout/", buyerViews.getPremiumFeatureCheckoutLink,
         name="get-premium-feature-checkout-link"),
    path("buyer/submit-review/<str:user_id>",
         buyerViews.submit_review, name="submit-review"),
   """  path("buyer/get-buyer-reviews/<str:buyer_id>",
         buyerViews.getBuyerReviews, name="get-buyer-reviews"), """
    path("buyer/<str:user_id>/get-reviews-buyer/",
         buyerViews.getReviews_buyer, name="get-reviews-buyer"),



]
