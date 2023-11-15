from app import adminViews, buyerViews, sellerViews, views
from app.adminViews import *
from app.buyerViews import *
from app.sellerViews import *
from app.views import *
from django.contrib import admin
from django.urls import include, path, re_path

urlpatterns = [
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
    path("add-preference/<str:user_id>/",
         views.update_seller_preferences, name="update_seller_preferences/user_id"),
    path('replace-image/<str:id>/<str:item_id>/<int:index>/',
         views.replace_image, name='replace_image'),



    # Generals
    path("register/", views.signUp, name="register"),
    path("sign-in/", views.signIn, name="login"),
    path("sign-up/", views.signUp, name="sign-up"),
    path("recover-password/", views.recoverPassword, name="recover-password"),
    path("verify-id-token/", views.verifyIdToken, name="verify-id-token"),
    path("retrieve-user-info-from-token/", views.retrieveUserInfoFromToken,
         name="retrieve-user-info-from-token"),
    path("update-profile/", views.updateProfile, name="update-profile"),
    path("listing/advertisement/<str:gender>/", views.getAdvertisementListing,
         name="get-listing-advertisement"),
    path("listing-detail/<str:item_id>", views.getListingDetailByItemId,
         name="get-listing-detail-by-item-id"),

    path("listing-by-item-id/<str:item_id>",
         views.getListingByItemId, name="get-listing-by-item-id"),
    path("item/", views.getAllItems, name="get-all-item"),
    path("user/", views.getAllUsers, name="get-all-user"),
    path("user/<str:user_id>", views.getUserById, name="get-user-by-id"),

    path('get-subcategory/', views.get_subcategories, name='get-subcategory'),
    path('get-all-category/', views.get_all_categories, name='get-all-category'),
    path('save-user-category/', views.save_user_categories,
         name='save-user-category'),




    path("reviews/", views.addReview, name="add-review"),
    path("paid-orders/<str:paid_order_id>/",
         views.updatePaidOrderStatus, name="update-paid-order-status"),

    # Webhook
    path("webhook/stripe/", views.webhookStripe, name="webhook-stripe"),


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
    path("seller/<str:user_id>/orders/", sellerViews.getAllOrdersByUserId,
         name="get-all-orders-by-user-id"),
    path("seller/orders/<str:paid_order_id>/",
         sellerViews.getOrderDetails, name="get-orders-detail"),
    path("seller/sales/<str:user_id>/", sellerViews.getSalesDetailsByUserId,
         name="get-sales-details-by-user-id"),
    path("seller/item/<str:seller_id>/", sellerViews.getAllListingBySellerId,
         name="get-all-item-by-seller-id"),

    # Buyer
    path("buyer/edit-review/", buyerViews.editReview, name="edit-review"),
    path("buyer/checkout/", buyerViews.getCheckoutLink, name="get-checkout-link"),

    path("buyer/cart/<str:cart_id>/<str:cart_item_id>/",
         buyerViews.updateCartItem, name="update-cart-item"),
    path("buyer/add-to-cart/", buyerViews.addToCart, name="add-to-cart"),
    path("buyer/add-to-wishlist/", buyerViews.addToWishlist, name="add-to-wishlist"),
    path("buyer/wishlist/<str:user_id>/",
         buyerViews.getWishlistListByUserId, name="get-wishlist-list"),
    path("buyer/wishlist/<str:user_id>/<str:wishlist_item_id>/",
         buyerViews.getWishlistDetails, name="get-wishlist-detail"),
    path("buyer/wishlist-item/<str:wishlist_id>/<str:wishlist_item_id>/",
         buyerViews.updateWishlistItem, name="get-wishlist-detail"),
    path("buyer/cart-details/<str:user_id>/",
         buyerViews.getCartDetailsByUserId, name="get-cart-detail-by-user-id"),
    path("buyer/<str:user_id>/orders/", buyerViews.getAllOrdersByUserId,
         name="get-all-orders-by-user-id"),
    path("buyer/orders/<str:paid_order_id>/",
         buyerViews.getOrderDetails, name="get-orders-detail"),
    path("buyer/order-status/<str:paid_order_id>/",
         buyerViews.getOrderStatus, name="get-order-status"),

    path("buyer/premium-feature-checkout/", buyerViews.getPremiumFeatureCheckoutLink,
         name="get-premium-feature-checkout-link"),


    # Admin
    path("admin/users/", adminViews.allUsers,
         name="admin-all-users"),

    path("admin/users/<str:user_id>/", adminViews.oneUser,
         name="admin-one-user"),

    path("fashion-category/", adminViews.fashionCategory, name="get-all-item"),
    path("fashion-category/<str:category_id>/",
         adminViews.fashionCategory, name="update-category"),

    path("feedback-admin/", adminViews.feedBack, name="get-all-feedback"),
    path("feedback-admin/<str:feedback_id>/",
         adminViews.feedBack, name="update-feedback"),


]
