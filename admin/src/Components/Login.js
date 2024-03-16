import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Css/styles.css";
import { AppContext } from "./GlobalContextProvider";

export default function Login({ onGoToSignup }) {
  const { setLogIn } = useContext(AppContext);
  const nagivate = useNavigate();

  const initialFormData = { username: "", password: "" };
  const [formData, setFormData] = useState(initialFormData);
  const [errorsLogin, setErrorsLogin] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const validateLogin = () => {
    let isValid = true;
    let newErrors = {};

    if (formData.username.trim() === "") {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (formData.password === "") {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrorsLogin(newErrors);

    return isValid;
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    if (validateLogin()) {
      try {
        const response = await axios.post(
          "http://localhost:3000/userauth/admin/login",
          formData
        );
        if (response.data.status) {
          console.log("data sent successfully:", response.data);
          // Assuming the server returns a token upon successful login
          const authToken = response.data.token;

          // Store the token in localStorage
          localStorage.setItem("token", authToken);
          nagivate("/displaybooks");
          setLogIn(true);
        } else {
          // console.error("Login failed:", response.data.message);
          // alert(`Login failed: ${response.data.message}`);
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        console.error("error sending data:", error);
      }
    }
  };

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorsLogin({ ...errorsLogin, [name]: "" });
  };
  const changeToSignup = () => {
    nagivate("/signup");
  };

  const changePassword = () => {
    nagivate("/forgotpassword");
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmitLogin}>
          <div className="form-fields">
            <label htmlFor="username">Username:</label>
            <div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChangeLogin}
              />
              <span style={{ color: "red" }}>{errorsLogin.username}</span>
            </div>
          </div>

          <div className="form-fields">
            <label htmlFor="password">Password:</label>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChangeLogin}
              />
              <span style={{ color: "red" }}>{errorsLogin.password}</span>
            </div>
          </div>

          <div className="login-button">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
      <div className="para-container">
        <p>or</p>
      </div>
      <div className="signup-button">
        <button type="button" onClick={changeToSignup}>
          Create an account - SignUp here
        </button>
      </div>
      <div className="forget-button">
        <button onClick={changePassword}>Forget Password</button>
      </div>
      <p>{errorMessage}</p>
    </div>
  );
}
