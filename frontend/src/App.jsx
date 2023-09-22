import PageRoutes from "./routes/PageRoutes";
import { Provider, useSelector } from "react-redux";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Store from "./redux/Store";
import Header from "./components/Header/Header";
import SignInForm from "./components/Form/SignInForm";
import SignUpForm from "./components/Form/SignUpForm";
import SellerOnBoard from "./pages/Seller/Onboarding/SellerOnBoard";
import ExistingSellerOnBoard from "./pages/Seller/Onboarding/ExistingSellerOnBoard";
import PremiumPopup from "./pages/Buyer/Recommender/PremiumPage";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import CookiePermission from "./components/CookiePermission";

import "./App.css";

const MainApp = () => {
  const stateGlobal = useSelector((state) => state);
  return (
    <div className="App">
      {stateGlobal.signInBool && <SignInForm />}
      {stateGlobal.signUpBool && <SignUpForm />}

      {stateGlobal.loadingBool && <Loading />}

      <Header />
      <PageRoutes />
      <Footer />

      {stateGlobal.premiumFeatureBool && <PremiumPopup />}
      {stateGlobal.sellerOnBoardBool && <SellerOnBoard />}
      {stateGlobal.existingSellerOnBoardBool && <ExistingSellerOnBoard />}
    </div>
  );
};

function App() {
  return (
    <Provider store={Store}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <CookiePermission />
        <Notifications position="bottom-right" autoClose={4000} />
        <MainApp />
      </MantineProvider>
    </Provider>
  );
}

export default App;
