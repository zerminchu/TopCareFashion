import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RecoverPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const confirmHandler = async () => {
    try {
      const data = { email: email };

      const response = await axios.post(
        `http://127.0.0.1:8000/recover-password/`,
        data
      );

      if (response.data.status == "success") {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <span>Reset Password</span>
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
      <button onClick={confirmHandler}>Confirm</button>
    </div>
  );
}

export default RecoverPassword;
