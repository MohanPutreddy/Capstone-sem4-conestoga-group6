import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/product/");
        setProducts(response.data?.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="partition-text">Shop</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id} className="product-card">
              <Link to={`/products/${product.id}`}>
                <div className="productImageContainer">
                  <img
                    src={`http://localhost:3000/uploads/${product.image}`}
                    alt={product.bookname}
                  />
                </div>
              </Link>

              <div>
                <p className="product-name">{product.bookname}</p>
                <p>${product.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
