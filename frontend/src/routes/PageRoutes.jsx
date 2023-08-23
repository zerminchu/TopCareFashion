import { Route, Routes } from "react-router-dom";
import DataDisplay from "../pages/DataDisplay";
import Test from "../pages/Test";
import Home from "../pages/Home";
import RecoverPassword from "../pages/RecoverPassword";
import UserProfile from "../pages/UserProfile";

function PageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recover-password" element={<RecoverPassword />} />;
      <Route path="/user-profile" element={<UserProfile />} />;
      <Route path="/display" element={<DataDisplay />} />;
      <Route path="/test" element={<Test />} />;
    </Routes>
  );
}
export default PageRoutes;
