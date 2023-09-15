import Cookies from "js-cookie";
import axios from "axios";

export const retrieveUserInfo = async () => {
  try {
    const firebaseIdToken = Cookies.get("firebaseIdToken");

    const url =
      import.meta.env.VITE_NODE_ENV == "DEV"
        ? import.meta.env.VITE_API_DEV
        : import.meta.env.VITE_API_PROD;

    const response = await axios.post(
      `${url}/retrieve-user-info-from-token/`,
      { firebaseIdToken: firebaseIdToken }
    );

    if (response.data.status == "success") {
      return response.data.data
    }
  } catch (error) {
    console.log(error);
  }
};