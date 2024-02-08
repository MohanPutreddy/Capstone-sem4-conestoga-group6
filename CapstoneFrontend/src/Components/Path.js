import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import Products from "./Products";
import Login from "./Login";
import SignUp from "./SignUp";

export default function Path() {
  return (
    <div>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/login">Log In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route
            path="/forgotpassword"
            element={<ForgotPassword></ForgotPassword>}
          ></Route>
          <Route path="/products" element={<Products></Products>}></Route>
        </Routes>
      </div>
    </div>
  );
}
