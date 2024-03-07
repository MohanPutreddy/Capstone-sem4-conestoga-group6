import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DisplayBooks() {
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
  const deleteProduct = async (id) => {
    console.log(id);
    try {
      await axios.delete("http://localhost:3000/product/", {
        data: { id },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="productsComponent">
      <h1 className="partition-text">Shop</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="product-list">
          {products.map((product) => (
            <div className="productCardWrapper">
              <li key={product.id} className="product-card">
                <div className="productImageContainer">
                  <img
                    src={`http://localhost:3000/uploads/${product.image}`}
                    alt={product.bookname}
                  />
                </div>

                <div>
                  <p className="product-name">{product.bookname}</p>
                  <p>${product.price}</p>
                </div>
                <div className="action-buttons">
                  <Link to={`/edit/${product.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                </div>
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
