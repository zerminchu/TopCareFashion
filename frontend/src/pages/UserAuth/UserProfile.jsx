import { useEffect, useState, useRef } from "react";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import IlDefaultAvatar from "../../assets/illustrations/il_avatar.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import "./UserProfile.css";

function UserProfile() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showImage, setShowImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();

        setUserId(user.user_id);
        setFirstName(user.name.first_name);
        setLastName(user.name.last_name);
        setEmail(user.email);
        setGender(user.gender);
        setDateOfBirth(user.date_of_birth);
        setShowImage(user.profile_image_url);
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setShowImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const saveOnClick = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("gender", gender);
      formData.append("profile_image", profileImage);

      const response = await axios.post(
        "http://127.0.0.1:8000/update-profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={saveOnClick}>
        <div className="rounded-image-container">
          <img
            src={showImage || IlDefaultAvatar}
            alt="Selected"
            className="rounded-image"
            onClick={handleButtonClick}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <br />

        <label>Email:</label>
        <input type="email" value={email} disabled />
        <br />

        <label>Date of Birth:</label>
        <input type="text" value={dateOfBirth} disabled />
        <br />

        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br />

        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <br />

        <label>Gender:</label>
        <label>
          <input
            type="radio"
            value="male"
            checked={gender === "male"}
            onChange={() => setGender("male")}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            value="female"
            checked={gender === "female"}
            onChange={() => setGender("female")}
          />
          Female
        </label>
        <br />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default UserProfile;
