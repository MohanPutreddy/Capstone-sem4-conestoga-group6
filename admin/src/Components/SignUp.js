import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Css/styles.css";
import { AppContext } from "./GlobalContextProvider";

export default function SignUp({ onGoToLogin }) {
  const { setLogIn } = useContext(AppContext);
  const nagivate = useNavigate();
  const initialFormData = { username: "", email: "", password: "" };
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState("");

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
      newErrors.password = "password is less than 6 characters ";
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
          "https://6811-99-251-82-105.ngrok-free.app/userauth/admin/signup",
          formData, {
            headers: {
              'ngrok-skip-browser-warning': '69420'
            }
          }
        );
        if (response.data.status) {
          console.log("data sent successfully:", response.data);
          // Assuming the server returns a token upon successful login
          const authToken = response.data.token;

          // Store the token in localStorage
          localStorage.setItem("token", authToken);
          setLogIn(true);
          nagivate("/products");
        } else {
          setErrorMessage(response.data.message);
          // console.error("Signup failed:", response.data.message);
        }
      } catch (error) {
        console.error("error sending data:", error);
      }
    }
  };

  const changeToLogin = () => {
    nagivate("/login");
  };

  const handleChangeSignUp = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorsSignUP({ ...errorsSignUP, [name]: "" });
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmitSignUp}>
          <div className="form-fields">
            <label htmlFor="username">Username:</label>
            <div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChangeSignUp}
              />
              <span style={{ color: "red" }}>{errorsSignUP.username}</span>
            </div>
          </div>

          <div className="form-fields">
            <label htmlFor="email">Email:</label>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChangeSignUp}
              />
              <span style={{ color: "red" }}>{errorsSignUP.email}</span>
            </div>
          </div>

          <div className="form-fields">
            <label htmlFor="password">Password:</label>
            <div>
              <input
                className="email-input"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChangeSignUp}
              />
              <span style={{ color: "red" }}>{errorsSignUP.password}</span>
            </div>
          </div>
          <div className="login-button">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      <div className="signin-button">
        <button type="button" onClick={changeToLogin}>
          Already a member? Sign In
        </button>
      </div>
      <p>{errorMessage}</p>
    </div>
  );
}
