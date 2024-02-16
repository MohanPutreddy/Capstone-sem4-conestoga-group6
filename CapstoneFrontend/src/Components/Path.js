import React, { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import Products from "./Products";
import Login from "./Login";
import SignUp from "./SignUp";
import "./Css/styles.css";
import { AppContext } from "./GlobalContextProvider";

export default function Path() {
  const { logIn, setLogIn } = useContext(AppContext);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogIn(false);
  };
  return (
    <div>
      <div>
        <header>
          <h1>BookWorld</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              {logIn ? (
                <div>
                  <li>
                    <button onClick={handleLogout}>Log out</button>
                  </li>
                </div>
              ) : (
                <div>
                  <li>
                    <Link to="/login">Log In</Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign Up</Link>
                  </li>
                </div>
              )}
            </ul>
          </nav>
        </header>
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
