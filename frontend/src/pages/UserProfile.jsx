import React, { useEffect, useState, useRef } from "react";
import { retrieveUserInfo } from "../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";

import "./UserProfile.css";

function UserProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();

        setFirstName(user.name.first_name);
        setLastName(user.name.last_name);
        setEmail(user.email);
        setDateOfBirth(user.date_of_birth);
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const saveOnClick = () => {
    console.log("save button click");
  };

  return (
    <div>
      <div className="rounded-image-container">
        <img
          src={selectedImage || "default_image.jpg"}
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

      <button onClick={saveOnClick}>Save</button>
    </div>
  );
}

export default UserProfile;
