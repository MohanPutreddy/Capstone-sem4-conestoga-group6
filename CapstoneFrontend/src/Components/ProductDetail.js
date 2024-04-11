import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "./GlobalContextProvider";
import { useParams, useNavigate } from "react-router-dom";
import NotificationSystem from "react-notification-system";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notificationSystem = useRef(null);
  const { cartItems, reFetchCart, logIn } = useContext(AppContext);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showNoReviews, setShowNoReviews] = useState(false);

  useEffect(() => {
    const findCount = cartItems?.find(
      (element) => element.productdetails.id === parseInt(id)
    );

    console.log(findCount);
    if (findCount?.count > 0) {
      setQuantity(findCount.count);
    }
  }, [cartItems, id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/product/${id}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product by ID:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const showNotification = (message) => {
    if (notificationSystem.current) {
      notificationSystem.current.addNotification({
        message,
        level: "success",
        position: "tc",
        autoDismiss: 1,
      });
    }
  };

  const showNotification2 = (message) => {
    if (notificationSystem.current) {
      notificationSystem.current.addNotification({
        message,
        level: "success",
        position: "tc",
        autoDismiss: 1,
      });
    }
  };

  const handleQuantityChange = async (value) => {
    if (logIn) {
      const newQuantity = quantity + value;
      if (newQuantity > -1) {
        try {
          await axios.get(`http://localhost:3000/cart/${id}/${newQuantity}`);

          setQuantity(newQuantity);
          reFetchCart();
          if (newQuantity > quantity) {
            showNotification("Product added to cart!");
          } else {
            showNotification2("Product removed from cart!");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    } else {
      navigate("/login");
    }
  };

  const fetchReviewsAndRatings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/product/ratings/${id}`
      );
      const { records, avgRating } = response.data;
      if (records.length === 0) {
        setShowNoReviews(true);
      } else {
        setShowNoReviews(false);
        setReviews(records);
        setAverageRating(avgRating);
      }
    } catch (error) {
      console.error("Error fetching reviews and ratings:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="usersViewProductsComponent">
          <div className="individualProductDisplay">
            <div className="productImageContainer-indi">
              <img
                src={`http://localhost:3000/uploads/${product.image}`}
                alt={product.bookname}
              />
            </div>
            <div className="productDetails">
              <p>
                <strong>{product.bookname}</strong>
              </p>
              <p>{product.description}</p>
              <p className="price">
                <strong>Price:</strong> ${product.price}
              </p>
              {product.discountpercent > 0 && (
                <div>
                  <p>
                    <strong>Sale Price:</strong> ${product.salePrice.toFixed(2)}
                  </p>
                  <p>
                    <strong>Discount Percent:</strong> $
                    {product.discountpercent}
                  </p>
                </div>
              )}
              <div className="quantityControl">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 0}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
              <div className="bookDescription">
                <h2>Book Description</h2>
                <p>
                  <strong>Author:</strong> {product.authorname}
                </p>
                <p>
                  <strong>Description:</strong> {product.description}
                </p>
                <button onClick={fetchReviewsAndRatings}>
                  Show Reviews & Ratings
                </button>
                {reviews.length > 0 && (
                  <div>
                    <h2>Reviews & Ratings</h2>
                    <p>Average Rating: {averageRating}</p>
                    <ul>
                      {reviews.map((review) => (
                        <li key={review.id}>
                          <p>Username: {review.username}</p>
                          <p>Review: {review.review}</p>
                          <p>Rating: {review.rating}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {showNoReviews && <p>No reviews available</p>}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* NotificationSystem component */}
      <NotificationSystem ref={notificationSystem} />
    </div>
  );
}
