import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import RecoverPassword from "../pages/RecoverPassword";
import UserProfile from "../pages/UserProfile";
import BusinessProfileForm from "../pages/Seller/BusinessProfileForm";

function PageRoutes() {
  return (
    <Routes>
      <Route path="/recover-password" element={<RecoverPassword />} />;
      <Route path="/user-profile" element={<UserProfile />} />;
      <Route path="/business-profile" element={<BusinessProfileForm />} />;
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
export default PageRoutes;
