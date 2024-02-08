import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [hide, setHide] = useState(true);
  const nagivate = useNavigate();
  // email from
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidEmail) {
      try {
        const response = await axios.post(
          "http://localhost:3000/userauth/forgotpassword",
          { email }
        );
        if (response.data.status) {
          console.log("otp sent", response.data);
          setHide(false);
        } else {
          console.error("otp not sent", response.data.message);
        }
      } catch (error) {
        console.error("error sending data:", error);
      }
    }
  };

  const handleChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailPattern.test(inputEmail));
  };
  // otp from
  const intialOtpForm = { otp: "", newPassword: "", confirmPassword: "" };
  const [OtpForm, setOtpForm] = useState(intialOtpForm);
  const [errorsOtp, setErrorsOtp] = useState("");

  const validOtpForm = () => {
    let isValid = true;
    let newErrors = {};
    if (OtpForm.otp.length === 0) {
      newErrors.otp = "Invalid otp";
      isValid = false;
    }
    if (OtpForm.newPassword.length < 6) {
      newErrors.newPassword = "password should be more than 6 characters";
      isValid = false;
    }
    if (OtpForm.confirmPassword !== OtpForm.newPassword) {
      newErrors.confirmPassword = "passwords does not match";
      isValid = false;
    }
    setErrorsOtp(newErrors);

    return isValid;
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (validOtpForm()) {
      try {
        const response = await axios.post(
          "http://localhost:3000/userauth/resetpassword",
          { ...OtpForm, email }
        );
        if (response.data.status) {
          console.log("new password sent", response.data);
          nagivate("/");
        } else {
          console.error("password not changed", response.data.message);
        }
      } catch (error) {
        console.error("error sending data:", error);
      }
    }
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpForm({ ...OtpForm, [name]: value });
  };

  return (
    <div>
      {hide ? (
        <div className="form-container">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              <label htmlFor="Email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
              ></input>
            </div>
            <div className="login-button">
              <button type="submit" disabled={!isValidEmail}>
                Send Email
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2>Change Password</h2>
          <form onSubmit={handleOtpSubmit}>
            <div>
              <label htmlFor="OTP">OTP</label>
              <input
                type="number"
                id="otp"
                name="otp"
                value={OtpForm.otp}
                onChange={handleOtpChange}
              ></input>
              <span style={{ color: "red" }}>{errorsOtp.otp}</span>
            </div>
            <div>
              <label htmlFor="newPassword"> New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={OtpForm.newPassword}
                onChange={handleOtpChange}
              />
              <span style={{ color: "red" }}>{errorsOtp.newPassword}</span>
            </div>
            <div>
              <label htmlFor="confirmPassword"> confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={OtpForm.confirmPassword}
                onChange={handleOtpChange}
              />
              <span style={{ color: "red" }}>{errorsOtp.confirmPassword}</span>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}
