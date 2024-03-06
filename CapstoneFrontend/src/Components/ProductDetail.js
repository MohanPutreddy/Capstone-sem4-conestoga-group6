import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProductDetail() {

  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await axios.get(`http://localhost:3000/product/${id}`)
          .then(response => {
            console.log(response.data);
            setProduct(response.data.product)

          })
        console.log("Line 20 in ProductDetail.js===>", product.ProductDetail);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching product by ID:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  return (
    <div>
      <h1 className="partition-text">Shop</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>{product.bookname}</h1>
          <img src={`http://localhost:3000/uploads/${product.image}`} alt={product.bookname} />
          <p>Author: {product.authorname}</p>
          <p>Price: ${product.price}</p>
          <p>Description: {product.description}</p>
        </div>
      )}
    </div>
  );
}
