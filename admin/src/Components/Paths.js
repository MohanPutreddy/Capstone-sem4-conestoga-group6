import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AddBook from "./AddBook";
import DisplayBooks from "./DisplayBooks";
import Home from "./Home";
import "./Css/styles.css";
import logo from '../logo/logo.png';

export default function Paths() {
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
                <Link to="/addbooks">ADD BOOKS</Link>
              </li>
              <li>
                <Link to="/displaybooks">BOOKS</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <><h2 className="partition-text">Admin Control Center</h2></>
          <div>
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route path="/addbooks" element={<AddBook></AddBook>}></Route>

              <Route
                path="/displaybooks"
                element={<DisplayBooks></DisplayBooks>}
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
