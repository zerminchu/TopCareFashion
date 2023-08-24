import React, { useState } from "react";
import axios from "axios";
import "./SignUpForm.css";

function SignUpForm() {
  const [userType, setUserType] = useState("buyer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleDateOfBirthChange = (event) => {
    setDateOfBirth(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleForgotPasswordClick = () => {
    console.log("Forgot Password clicked");
  };

  const handleSignUpClick = async () => {
    try {
      const data = {
        role: userType,
        name: {
          first_name: firstName,
          last_name: lastName,
        },
        email: email,
        date_of_birth: dateOfBirth,
        password: password,
        confirm_password: confirmPassword,
      };
      console.log("Data: ", data);
      const response = await axios.post(`http://127.0.0.1:8000/sign-up/`, data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="popup-content">
      <select value={userType} onChange={handleUserTypeChange}>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
        <option value="admin">Admin</option>
      </select>
      <br />

      <label>Firstname</label>
      <br />
      <input
        type="text"
        placeholder="Firstname"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <br />

      <label>Lastname</label>
      <br />
      <input
        type="text"
        placeholder="Lastname"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <br />

      <label>Email</label>
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <br />

      <label>Date of Birth:</label>
      <br />

      <input
        type="date"
        value={dateOfBirth}
        onChange={handleDateOfBirthChange}
      />
      <br />

      <label>Password</label>
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <br />

      <label>Confirm password</label>
      <br />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
      />
      <br />

      <button onClick={handleSignUpClick}>Sign Up</button>
    </div>
  );
}

export default SignUpForm;
