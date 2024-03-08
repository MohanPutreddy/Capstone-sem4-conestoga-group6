import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countNo, setCountNo] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await axios
          .get(`http://localhost:3000/product/${id}`)
          .then((response) => {
            console.log(response.data);
            setProduct(response.data.product);
          });
        console.log("Line 20 in ProductDetail.js===>", product.ProductDetail);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product by ID:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const addToCart = async (id) => {
    try {
      await axios.get(`http://localhost:3000/cart/${id}/${1}`);
      setCountNo(true);
    } catch (error) {
      console.error("Error fetching data:", error);
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
