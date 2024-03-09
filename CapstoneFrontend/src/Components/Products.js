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
    <div className="usersViewProductsComponent">
      <h1 className="partition-text">Shop</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-2">
              <div className="product-box">
                <div className="thumbnail">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={`http://localhost:3000/uploads/${product.image}`}
                      alt={product.bookname}
                      className="img-thumbnail"
                    />
                  </Link>
                  <p className="product-name">{product.bookname}</p>
                  <p>Price: ${product.price}</p>
                </div>
                <Link to={`/product/${product.id}`}>
                  <button className="btn btn-light">Buy</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
