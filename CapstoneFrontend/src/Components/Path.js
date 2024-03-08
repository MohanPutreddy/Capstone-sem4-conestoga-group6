import React, { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import Products from "./Products";
import Login from "./Login";
import SignUp from "./SignUp";
import "./Css/styles.css";
import { AppContext } from "./GlobalContextProvider";
import logo from "../logo/logo.png";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import { useNavigate } from "react-router-dom";
export default function Path() {
  const navigate = useNavigate();
  const { logIn, setLogIn } = useContext(AppContext);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogIn(false);
    navigate("/login");
  };
  return (
    <>
      <>
        <header>
          <div>
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              {logIn ? (
                <>
                  <li>
                    <Link to="/cart">Cart</Link>
                  </li>

                  <li>
                    <button onClick={handleLogout} className="header-button">
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">
                      <i className="fa fa-sign-in"></i>Log In
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
      </>
      <main>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<SignUp></SignUp>}></Route>
          <Route path="/cart" element={<Cart></Cart>}></Route>
          <Route
            path="/forgotpassword"
            element={<ForgotPassword></ForgotPassword>}
          ></Route>
          <Route path="/products" element={<Products></Products>}></Route>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <footer>&copy; Group 6 - 2024 Winter - Sec 8</footer>
    </>
  );
}
