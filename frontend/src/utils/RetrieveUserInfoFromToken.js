import Cookies from "js-cookie";
import axios from "axios";

export const retrieveUserInfo = async () => {
  try {
    const firebaseIdToken = Cookies.get("firebaseIdToken");

    const response = await axios.post(
      `${import.meta.env.VITE_API_DEV}/retrieve-user-info-from-token/`,
      { firebaseIdToken: firebaseIdToken }
    );

    if (response.data.status == "success") {
      return response.data.data
    }
  } catch (error) {
    console.log(error);
  }
};