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
  const [imageSrc, setImageSrc] = useState(""); // State to hold the base64 image data

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
        const response = await axios.get(`https://6811-99-251-82-105.ngrok-free.app/product/${id}`, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        });
        setProduct(response.data.product);
        setLoading(false);
        fetchAndDisplayImage(response.data.product.image);
      } catch (error) {
        console.error("Error fetching product by ID:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const fetchAndDisplayImage = async (imageName) => {
    try {
      const response = await axios.get(`https://6811-99-251-82-105.ngrok-free.app/uploads/${imageName}`, {
        responseType: 'blob', // set the response type to blob
        headers: {
          'Content-Type': 'image/jpeg',
          'ngrok-skip-browser-warning': '69420'
        }
      });
      
      // Read the image data as a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = () => {
        setImageSrc(reader.result); // set the base64 image data to the state
      };
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

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

  const handleQuantityChange = async (value) => {
    if (logIn) {
      const newQuantity = quantity + value;
      if (newQuantity > -1) {
        try {
          await axios.get(`https://6811-99-251-82-105.ngrok-free.app/cart/${id}/${newQuantity}`, {
            headers: {
              'ngrok-skip-browser-warning': '69420'
            }
          });

          setQuantity(newQuantity);
          reFetchCart();
          if (newQuantity > quantity) {
            showNotification("Product added to cart!");
          } else {
            showNotification("Product removed from cart!");
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
        `https://6811-99-251-82-105.ngrok-free.app/product/ratings/${id}`, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
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
                src={imageSrc} // Use the base64 image data here
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
