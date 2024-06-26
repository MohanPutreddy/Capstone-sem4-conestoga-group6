import React, { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AddBook from "./AddBook";
import DisplayBooks from "./DisplayBooks";
import Home from "./Home";
import "./Css/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import logo from "../logo/logo.png";
import { AppContext } from "./GlobalContextProvider";
import Login from "./Login";
import SignUp from "./SignUp";
import ManageUser from "./ManageUser";
import ForgotPassword from "./ForgotPassword";
import AddCategory from "./AddCategory";
import EditBooks from "./EditBooks";
import { useNavigate } from "react-router-dom";
import Users from "./Users";
import UserOrderHistory from "./UserOrderHistory";
export default function Paths() {
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
              {logIn ? (
                <>
                  <li>
                    <Link to="/addbooks">ADD BOOKS</Link>
                  </li>
                  <li>
                    <Link to="/displaybooks">BOOKS</Link>
                  </li>
                  <li>
                    <Link to="/addcategory">ADD CATEGORY</Link>
                  </li>
                  <li>
                    <Link to="/users">USERS</Link>
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
        <main>
          <>
            <h2 className="partition-text">Admin Control Center</h2>
          </>
          <div>
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/signup" element={<SignUp></SignUp>}></Route>
              <Route
                path="/forgotpassword"
                element={<ForgotPassword></ForgotPassword>}
              ></Route>
              <Route path="/addbooks" element={<AddBook></AddBook>}></Route>
              <Route path="/users" element={<Users></Users>}></Route>
              <Route
                path="/addcategory"
                element={<AddCategory></AddCategory>}
              ></Route>
              <Route path="/edit/:productId" element={<EditBooks />} />
              <Route
                path="/manageuser"
                element={<ManageUser></ManageUser>}
              ></Route>
              <Route
                path="/displaybooks"
                element={<DisplayBooks></DisplayBooks>}
              ></Route>
              <Route
                path="/userorderhistory/:id"
                element={<UserOrderHistory></UserOrderHistory>}
              ></Route>
            </Routes>
          </div>
        </main>

        <footer>
          &copy; Admin Control Center - Group 6 - 2024 Winter - Sec 8
        </footer>
      </>
    </>
  );
}
