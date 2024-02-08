import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import Products from "./Products";

export default function Path() {
  return (
    <div>
      {/* <div>
        <nav>
          <ul>
            <li>
              <Link to="/products">Products</Link>
            </li>
          </ul>
        </nav>
      </div> */}
      <div>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
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
