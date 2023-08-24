import Cookies from "js-cookie";
import axios from "axios";

export const retrieveUserInfo = async () => {
  try {
    const firebaseIdToken = Cookies.get("firebaseIdToken");

    const response = await axios.post(
      `http://127.0.0.1:8000/retrieve-user-info-from-token/`,
      { firebaseIdToken: firebaseIdToken }
    );

    if (response.data.status == "success") {
      return response.data.data
    }
  } catch (error) {
    console.log(error);
  }
};