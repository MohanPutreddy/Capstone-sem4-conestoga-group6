import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AddBook from "./AddBook";
import DisplayBooks from "./DisplayBooks";
import Home from "./Home";

export default function Paths() {
  return (
    <div>
      <div>
        <div>
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
        </div>
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
      </div>
    </div>
  );
}
