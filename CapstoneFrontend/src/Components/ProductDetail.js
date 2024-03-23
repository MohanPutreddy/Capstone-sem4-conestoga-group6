import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "./GlobalContextProvider";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, reFetchCart, logIn } = useContext(AppContext);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0); // Default quantity is 1

  useEffect(() => {
    const findCount = cartItems?.find(
      (element) => element.productdetails.id == id
    );

    console.log(findCount);
    if (findCount?.count > 0) {
      setQuantity(findCount.count);
    }
  }, [cartItems, id]);

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

  const handleQuantityChange = async (value) => {
    if (logIn) {
      const newQuantity = quantity + value;
      if (newQuantity > -1) {
        try {
          await axios.get(`http://localhost:3000/cart/${id}/${newQuantity}`);
          // setAddedToCart(true);
          setQuantity(newQuantity);
          reFetchCart();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    } else {
      navigate("/login");
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
                  disabled={quantity === 0}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
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
