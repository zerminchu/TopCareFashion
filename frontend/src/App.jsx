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
import ReactGA from "react-ga4";

import "./App.css";
import AddToCart from "./components/AddToCart";
import BuyerPreferences from "./pages/Buyer/BuyerPreferences";

const MainApp = () => {
  const stateGlobal = useSelector((state) => state);
  return (
    <div className="App">
      {stateGlobal.signInBool && <SignInForm />}
      {stateGlobal.signUpBool && <SignUpForm />}

      {stateGlobal.loadingBool && <Loading />}
      {stateGlobal.buyerPreferencesBool && <BuyerPreferences />}

      <Header />
      <PageRoutes />
      <Footer />

      {stateGlobal.cartBool && <AddToCart cartData={stateGlobal.cartData} />}
      {stateGlobal.premiumFeatureBool && <PremiumPopup />}
      {stateGlobal.sellerOnBoardBool && <SellerOnBoard />}
      {stateGlobal.existingSellerOnBoardBool && <ExistingSellerOnBoard />}
    </div>
  );
};

function App() {
  ReactGA.initialize([
    {
      trackingId: "G-0X2BFHBPSP",
    },
  ]);
  /* ReactGA.send({
    hitType: "pageview",
    page: "/",
    title: "Custom Title",
  }); */

  const pageViewsTracking = (props) => {
    const pathname = props.match.path;
    let pageView;
    if (pathname === "*") pageView = "/not-found";
    else pageView = pathname;

    ReactGA.pageView(pageView);
  };
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
