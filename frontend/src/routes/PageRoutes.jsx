import { Route, Routes } from "react-router-dom";
import DataDisplay from "../pages/DataDisplay";
import Test from "../pages/Test";

function PageRoutes() {
  return (
    <Routes>
      <Route path="/display" element={<DataDisplay />} />;
      <Route path="/test" element={<Test />} />;
    </Routes>
  );
}
export default PageRoutes;
