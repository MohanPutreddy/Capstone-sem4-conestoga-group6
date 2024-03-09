import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DisplayBooks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    try {
      await axios.delete("http://localhost:3000/product/", {
        data: { id },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filtering products based on the search query
  const filteredProducts = products.filter(product =>
    product.bookname.toLowerCase().includes(searchQuery.toLowerCase())
  ); //

  return (
    <div className="productsComponent">
      <h1 className="partition-text">Books</h1>

      <div className="searchAndSortComponent">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)} // Step 2
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="product-list">
          {filteredProducts.map((product) => (
            <div className="product-box">
              <li key={product.id}>
                <div className="thumbnail">
                  <img
                    src={`http://localhost:3000/uploads/${product.image}`}
                    alt={product.bookname}
                    className="img-thumbnail"
                  />
                </div>

                <div>
                  <p className="product-name">{product.bookname}</p>
                  <p>Price: ${product.price}</p>
                </div>
                <div className="action-buttons">
                  <Link to={`/edit/${product.id}`}>
                    <button className="btn btn-secondary">Edit</button>
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="btn btn-secondary"
                  >
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
