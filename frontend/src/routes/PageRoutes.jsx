import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import RecoverPassword from "../pages/RecoverPassword";
import UserProfile from "../pages/Seller/UserProfile";
import ImageUpload from "../pages/Seller/ImageUpload";
import ListItem from "../pages/Seller/ListItem";
import SellerHome from "../pages/Seller/SellerHome";
import EditListing from "../pages/Seller/EditListing";
import BusinessProfileForm from "../pages/Seller/BusinessProfileForm";
import BusinessProfile from "../pages/Seller/BusinessProfile";
import Ratings from "../pages/Seller/Ratings";
import ProductDetails from "../pages/Buyer/ProductDetails";
import Checkout from "../pages/Buyer/Checkout";
import FrequentlyAskQuestion from "../pages/Seller/FrequentlyAskQuestion";
import FeedbackForm from "../pages/Seller/FeedbackForm";
import Transactions from "../pages/Buyer/Transactions";
import BuyerCart from "../pages/Buyer/BuyerCart";
import Wishlist from "../pages/Buyer/Wishlist";
import CategoryListingsPage from "../components/CategoryListing";
import Chatting from "../pages/Chatting";
import NotFoundImage from "../components/NotFound";
import OutfitRecommender from "../pages/Buyer/OutfitRecommender";
import ProductRate from "../pages/Buyer/BuyerRateProduct";
import OrderStatus from "../pages/Seller/OrderStatus";
import PremiumPopup from "../pages/Buyer/PremiumPage";
import MixAndMatch from "../pages/Buyer/MixAndMatch";

function PageRoutes() {
  return (
    <Routes>
      {/* Private route for seller */}
      <Route path="seller/create-listing" element={<ListItem />} />;
      <Route path="/edit-listing/:id/:item_id/" element={<EditListing />} />
      <Route path="/seller-home/:id" element={<SellerHome />} />;
      <Route path="/seller/business-profile" element={<BusinessProfile />} />
      <Route
        path="/seller/frequently-ask-question"
        element={<FrequentlyAskQuestion />}
      />
      <Route path="/seller/upload-image" element={<ImageUpload />} />;
      <Route
        path="/seller/edit-business-profile"
        element={<BusinessProfileForm />}
      />
      <Route path="/seller/feedback-form" element={<FeedbackForm />} />
      <Route path="/seller/ratings" element={<Ratings />} />
      <Route path="/seller/order-status" element={<OrderStatus />} />;
      {/* Private route for buyer */}
      <Route path="/buyer/product-detail" element={<ProductDetails />} />
      <Route path="/buyer/wishlist" element={<Wishlist />} />
      <Route path="/buyer/checkout" element={<Checkout />} />
      <Route path="/buyer/product-rate" element={<ProductRate />} />
      <Route path="/buyer/transactions" element={<Transactions />} />
      <Route path="/buyer/buyer-cart" element={<BuyerCart />} />
      <Route
        path="/buyer/category-listing/:category"
        element={<CategoryListingsPage />}
      />
      <Route path="/buyer/premium-feature" element={<MixAndMatch />} />
      <Route path="/not-found" element={<NotFoundImage />} />
      <Route path="/outfit-recommender" element={<OutfitRecommender />} />;
      {/* Private route */}
      <Route path="/user-profile" element={<UserProfile />} />;
      <Route path="/chatting" element={<Chatting />} />
      {/* Public route */}
      <Route path="/recover-password" element={<RecoverPassword />} />;
      <Route path="/" element={<Home />} />
      <Route path="*" element={<h1>Page not found</h1>} />
    </Routes>
  );
}
export default PageRoutes;
