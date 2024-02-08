import React, { useState, useEffect } from "react";
import axios from "axios";

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
      <h1>Product List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <img
                src={`http://localhost:3000/uploads/${product.image}`}
                alt={product.bookname}
                style={{ maxWidth: "100px" }}
              />
              <div>
                <p>{product.bookname}</p>
                <p>${product.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
