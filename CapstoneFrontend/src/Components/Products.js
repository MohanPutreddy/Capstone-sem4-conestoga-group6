import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/product/");
        setProducts(response.data?.products || []);
        setDisplayProducts(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    result = result.filter((product) =>
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
    <div className="usersViewProductsComponent">
      <h1 className="partition-text">Shop</h1>

      <div className="searchAndSortComponent">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control"
        />

        <select
          className="form-select"
          onChange={handleSortChange}
          value={sortOrder}
        >
          <option value="name-asc">Name (A to Z)</option>
          <option value="name-desc">Name (Z to A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="product-list">
          {displayProducts.map((product) => (
            <div className="productImageContainer">
              <div key={product.id}>
                <div className="product-card">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={`http://localhost:3000/uploads/${product.image}`}
                      alt={product.bookname}
                      className="img-thumbnail"
                    />
                  </Link>
                  <p className="product-name">{product.bookname}</p>
                  <p>
                    <strong>Price:</strong> ${product.price}
                  </p>
                  {product.discountpercent > 0 && (
                    <div>
                      <p>
                        <strong>Sale Price:</strong> ${product.salePrice}
                      </p>
                      <p>
                        <strong>Discount Percent:</strong> $
                        {product.discountpercent}
                      </p>
                    </div>
                  )}
                  <Link to={`/product/${product.id}`}>
                    <button className="btn btn-light">Buy</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
