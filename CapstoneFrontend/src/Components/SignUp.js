import { useState } from "react";
import axios from "axios";

export default function SignUp({ onGoToLogin }) {
  const initialFormData = { username: "", email: "", password: "" };
  const [formData, setFormData] = useState(initialFormData);

  const [errorsSignUP, setErrorsSignUP] = useState({});

  const validateSignUp = () => {
    let isValid = true;
    let newErrors = {};

    if (formData.username.trim() === "") {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Invalid password address";
      isValid = false;
    }

    setErrorsSignUP(newErrors);

    return isValid;
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();

    if (validateSignUp()) {
      try {
        const response = await axios.post(
          "http://localhost:3000/userauth/signup",
          formData
        );
        if (response.data.status) {
          console.log("data sent successfully:", response.data);
          alert("Login successful");
        } else {
          console.error("Login failed:", response.data.message);
          alert(`Login failed: ${response.data.message}`);
        }
      } catch (error) {
        console.error("error sending data:", error);
      }
    }
  };

  const handleChangeSignUp = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorsSignUP({ ...errorsSignUP, [name]: "" });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmitSignUp}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChangeSignUp}
          />
          <span style={{ color: "red" }}>{errorsSignUP.username}</span>
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChangeSignUp}
          />
          <span style={{ color: "red" }}>{errorsSignUP.email}</span>
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChangeSignUp}
          />
          <span style={{ color: "red" }}>{errorsSignUP.password}</span>
        </div>

        <button type="submit">Submit</button>

        <div>
          <button type="button" onClick={onGoToLogin}>
            Go to Login
          </button>
        </div>
      </form>
    </div>
  );
}
