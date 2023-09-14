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

function PageRoutes() {
  return (
    <Routes>
      <Route path="/recover-password" element={<RecoverPassword />} />;
      <Route path="/user-profile" element={<UserProfile />} />;
      <Route path="/upload-image" element={<ImageUpload />} />;
      <Route path="/create-listing" element={<ListItem />} />;
      <Route path="/edit-listing" element={<EditListing />} />; //
      <Route path="/seller-home/:id" element={<SellerHome />} />;
      <Route path="/seller/business-profile" element={<BusinessProfile />} />
      <Route path="/seller/ratings" element={<Ratings />} />
      <Route path="/buyer/product-detail" element={<ProductDetails />} />
      <Route
        path="/seller/edit-business-profile"
        element={<BusinessProfileForm />}
      />
      ;
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
export default PageRoutes;
