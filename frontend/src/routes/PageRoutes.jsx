import { Route, Routes } from "react-router-dom";
import DataDisplay from "../pages/DataDisplay";

function PageRoutes() {
  return (
    <Routes>
      <Route path="/display" element={<DataDisplay />} />;
    </Routes>
  );
}

export default PageRoutes;
