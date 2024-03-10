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
      const findCount = cartItems.find(
        (element) => element.productdetails.id === id
      );
      console.log(findCount);
      if (findCount?.count > 0) {
        setCountNo(true);
      } else {
        try {
          await axios.get(`http://localhost:3000/cart/${id}/${1}`);
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

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="usersViewProductsComponent">
          <h1 className="partition-text">{product.bookname}</h1>
          <div className="individualProductDisplay">
            <div className="productImageContainer-indi">
              <img
                src={`http://localhost:3000/uploads/${product.image}`}
                alt={product.bookname}
              />
            </div>

            <div>
              <p>
                <strong>Author: </strong>
                {product.authorname}
              </p>
              <p>
                <strong>Description: </strong> {product.description}
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              {countNo ? (
                <p>Item already in cart</p>
              ) : addedToCart ? (
                <p>Item added to cart</p>
              ) : (
                <button onClick={() => addToCart(product.id)}>ADD CART</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
