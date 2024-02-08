import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [hide, setHide] = useState(true);
  const nagivate = useNavigate();
  // email from
  const initialEmail = { email: "" };
  const [Email, setEmail] = useState(initialEmail);
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidEmail) {
      console.log(Email);
      setHide(false);
    }
  };

  const handleChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailPattern.test(inputEmail));
  };
  // otp from
  const intialOtpForm = { otp: "", newpassword: "", confirmPassword: "" };
  const [OtpForm, setOtpForm] = useState(intialOtpForm);
  const [errorsOtp, setErrorsOtp] = useState("");

  const validOtpForm = () => {
    let isValid = true;
    let newErrors = {};
    if (OtpForm.otp.length !== 4) {
      newErrors.otp = "Invalid otp";
      isValid = false;
    }
    if (OtpForm.newpassword.length < 6) {
      newErrors.newpassword = "password should be more than 6 characters";
      isValid = false;
    }
    if (OtpForm.confirmPassword !== OtpForm.newpassword) {
      newErrors.confirmPassword = "passwords does not match";
      isValid = false;
    }
    setErrorsOtp(newErrors);

    return isValid;
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (validOtpForm()) {
      console.log(OtpForm);
      nagivate("/");
    }
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpForm({ ...OtpForm, [name]: value });
  };

  return (
    <div>
      {hide ? (
        <div>
          <h2>ForgotPassword</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="Email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={Email.email}
                onChange={handleChange}
              ></input>
            </div>
            <div>
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
              <label htmlFor="newpassword"> New Password:</label>
              <input
                type="password"
                id="newpassword"
                name="newpassword"
                value={OtpForm.newpassword}
                onChange={handleOtpChange}
              />
              <span style={{ color: "red" }}>{errorsOtp.newpassword}</span>
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
