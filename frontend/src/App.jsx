import PageRoutes from "./routes/PageRoutes";
import { Provider, useSelector } from "react-redux";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Store from "./redux/Store";
import { LoadingOverlay } from "@mantine/core";
import Header from "./components/Header/Header";
import SignInForm from "./components/Form/SignInForm";
import SignUpForm from "./components/Form/SignUpForm";
import SellerOnBoard from "./pages/Seller/SellerOnBoard";

//import "./App.css";

const MainApp = () => {
  const stateGlobal = useSelector((state) => state);
  return (
    <div>
      {stateGlobal.signInBool && <SignInForm />}
      {stateGlobal.signUpBool && <SignUpForm />}

      {stateGlobal.loadingBool && (
        <LoadingOverlay visible={true} overlayBlur={2} />
      )}
      <Header />
      {stateGlobal.sellerOnBoardBool && <SellerOnBoard />}
      <PageRoutes />
    </div>
  );
};

function App() {
  return (
    <Provider store={Store}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <Notifications position="bottom-right" autoClose={4000} />
        <MainApp />
      </MantineProvider>
    </Provider>
  );
}

export default App;
