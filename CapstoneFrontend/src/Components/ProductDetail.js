import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "./GlobalContextProvider";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { cartItems, reFetchCart, logIn } = useContext(AppContext);
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countNo, setCountNo] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  // const [showQuantity, setShowQuantity] = useState(false);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await axios
          .get(`http://localhost:3000/product/${id}`)
          .then((response) => {
            setProduct(response.data.product);
          });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product by ID:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const addToCart = async (id) => {
    if (logIn) {
      const findCount = cartItems?.find(
        (element) => element.productdetails.id === id
      );
      console.log(findCount);
      if (findCount?.count > 0) {
        setCountNo(true);
      } else {
        try {
          await axios.get(`http://localhost:3000/cart/${id}/${quantity}`);
          setAddedToCart(true);
          reFetchCart();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    } else {
      navigate("/login");
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
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
              <div className="quantityControl">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
              {product.discountpercent > 0 && (
                <div>
                  <p>
                    <strong>Sale Price:</strong> ${product.salePrice}
                  </p>
                  <p>
                    <strong>Discount Percent:</strong> $
                    {product.discountpercent}
                  </p>
                </div>
              )}

              {countNo ? (
                <p className="cartMessage">Item already in cart</p>
              ) : addedToCart ? (
                <p className="cartMessage">Item added to cart</p>
              ) : (
                <button onClick={() => addToCart(product.id)}>ADD CART</button>
              )}
            </div>
          </div>
          <div className="bookDescription">
            <h2>Book Description</h2>
            <p>
              <strong>Author:</strong> {product.authorname}
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
