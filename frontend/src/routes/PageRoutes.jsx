import { Route, Routes } from "react-router-dom";
import CategoryListingsPage from "../components/CategoryListing";
import NotFoundImage from "../components/NotFound";
import BuyerHomeMen from "../pages/Buyer/Buyer Home/BuyerHomeMen";
import BuyerHomeWomen from "../pages/Buyer/Buyer Home/BuyerHomeWomen";
import BuyerCart from "../pages/Buyer/BuyerCart";
import ProductRate from "../pages/Buyer/BuyerRateProduct";
import ProductStatus from "../pages/Buyer/BuyerViewOrderStatus";
import Checkout from "../pages/Buyer/Checkout";
import ProductDetails from "../pages/Buyer/ProductDetails";
import MixAndMatch from "../pages/Buyer/Recommender/MixAndMatch";
import Transactions from "../pages/Buyer/Transactions";
import Wishlist from "../pages/Buyer/Wishlist";
import FeedbackForm from "../pages/FeedbackForm";
import FrequentlyAskQuestion from "../pages/FrequentlyAskQuestion";
import Home from "../pages/Home";
import RecoverPassword from "../pages/RecoverPassword";
import BusinessProfile from "../pages/Seller/Business Profile/BusinessProfile";
import BusinessProfileForm from "../pages/Seller/Business Profile/BusinessProfileForm";
import OrderStatus from "../pages/Seller/OrderStatus";
import Ratings from "../pages/Seller/Ratings";
import SellerHome from "../pages/Seller/SellerHome";
import Chatting from "../pages/Seller/Transactions/Chatting";
import EditListing from "../pages/Seller/Transactions/EditListing";
import ImageUpload from "../pages/Seller/Transactions/ImageUpload";
import ListItem from "../pages/Seller/Transactions/ListItem";
import UserProfile from "../pages/Seller/UserProfile";
import SellerSummary from "../pages/Seller/SellerSummary";
import CategorySelection from "../pages/Seller/Transactions/CategorySelection";
import SpecificSellerListings from "../pages/Buyer/SpecificSellerListings";
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
      <Route path="/seller/summary" element={<SellerSummary />} />;
      <Route
        path="/seller/category-selection/"
        element={<CategorySelection />}
      />
      ;{/* Private route for buyer */}
      <Route path="/men" element={<BuyerHomeMen />} />
      <Route path="/women" element={<BuyerHomeWomen />} />
      <Route
        path="/buyer/product-detail/:itemId"
        element={<ProductDetails />}
      />
      <Route path="/buyer/wishlist" element={<Wishlist />} />
      <Route path="/buyer/checkout" element={<Checkout />} />
      <Route path="/buyer/product-rate" element={<ProductRate />} />
      <Route path="/buyer/transactions" element={<Transactions />} />
      <Route path="/buyer/buyer-cart" element={<BuyerCart />} />
      <Route
        path="/buyer/category-listing/:category"
        element={<CategoryListingsPage />}
      />
      <Route path="/buyer/product-order-status" element={<ProductStatus />} />
      <Route path="/buyer/premium-feature" element={<MixAndMatch />} />
      <Route path="/not-found" element={<NotFoundImage />} />
      <Route
        path="/buyer/specific-seller-listings/"
        element={<SpecificSellerListings />}
      />
      {/* <Route path="/outfit-recommender" element={<OutfitRecommender />} />; */}
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
