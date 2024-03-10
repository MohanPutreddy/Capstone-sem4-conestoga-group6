import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DisplayBooks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [displayProducts, setDisplayProducts] = useState([]);

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

  useEffect(() => {
    let result = [...products];
    result = result.filter(product =>
      product.bookname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortOrder) {
      case "name-asc":
        result.sort((a, b) => a.bookname.localeCompare(b.bookname));
        break;
      case "name-desc":
        result.sort((a, b) => b.bookname.localeCompare(a.bookname));
        break;
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        break;
    }

    setDisplayProducts(result);
  }, [products, searchQuery, sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="productsComponent">
      <h1 className="partition-text">Books</h1>

      <div className="searchAndSortComponent">
        <input className="form-control" 
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select  className="form-select" onChange={handleSortChange} value={sortOrder}>
          <option value="name-asc">Name (A to Z)</option>
          <option value="name-desc">Name (Z to A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="product-list">
          {displayProducts.map((product) => (
            <div className="productImageContainer">
              <div key={product.id}>
                <li key={product.id}  className="product-card">
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
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
