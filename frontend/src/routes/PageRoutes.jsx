import { Route, Routes } from "react-router-dom";
import DataDisplay from "../pages/DataDisplay";
import Test from "../pages/Test";
import Home from "../pages/Home";
import RecoverPassword from "../pages/UserAuth/RecoverPassword";
import UserProfile from "../pages/UserAuth/UserProfile";
import ImageUpload from "../pages/Seller/ImageUpload";
import ListItem from "../pages/Seller/ListItem";
import SellerHome from "../pages/Seller/SellerHome";

function PageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recover-password" element={<RecoverPassword />} />;
      <Route path="/user-profile" element={<UserProfile />} />;
      <Route path="/upload-image" element={<ImageUpload />} />;
      <Route path="/create-listing" element={<ListItem />} />;
      <Route path="/display" element={<DataDisplay />} />;
      <Route path="/test" element={<Test />} />;
      <Route path="/seller-home/:id" element={<SellerHome />} />;
    </Routes>
  );
}
export default PageRoutes;
