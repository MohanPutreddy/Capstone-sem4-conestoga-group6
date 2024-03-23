import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bannerImage from "../Images/banner_image.jpg";
import { Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/category");
        if (response.data) {
          setCategories(response.data);
        } else {
          console.error("Unable to fetch categories:");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const viewBooks = () => {
    console.log("hai");
    navigate("/products");
  };
  const viewSaleBooks = () => {
    console.log("hai");
    navigate("/products?type=sale");
  };

  return (
    <div className="body">
      <div className="image-container" onClick={viewBooks}>
        <img src={bannerImage} alt="Banner" />
        <div className="overlay">Click here to veiw all Books</div>
      </div>

      <div className="main">
        <section className="intro">
          <h1>Welcome to Our Books World</h1>
          <p>
            We're proud to have served
            <span className="highlight">10,000+</span> satisfied customers and
            counting.
          </p>
          <p>Discover a world of literary treasures with us.</p>
        </section>
        <section className="explore">
          <h2>Different categories</h2>
          <p>Click below buttons to view books of different category</p>
          <ul className="button-list">
            <div>
              {categories.map((category) => (
                <Link to={`/products?id=${category.id}`}>
                  <button
                    key={category.id}
                    value={category.id}
                    className="button-link"
                  >
                    {category.name}
                  </button>
                </Link>
              ))}
            </div>
          </ul>
        </section>

        <section className="offer image-container" onClick={viewSaleBooks}>
          <div className="offer-content">
            <h7 className="offer-text">
              Don't miss out on these incredible deals which are only available
              in Books world!
            </h7>
            <p>Click here to view Books on Sale</p>
          </div>
          <div className="overlay">
            <p>Books on Sale!</p>
          </div>
        </section>
      </div>
    </div>
  );
}
