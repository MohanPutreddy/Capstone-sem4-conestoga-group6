import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Products() {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("id") ? parseInt(params.get("id")) : "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [displayProducts, setDisplayProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/category");
        if (response.data) {
          setCategories(response.data);
        } else {
          console.error("Unable to fetch categories:");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
      {categoryId ? (
        <h5>
          Displaying products under{" "}
          {categories.find((o) => o.id === categoryId)?.name}
        </h5>
      ) : (
        <></>
      )}
      {params.get("type") === "sale" && (
        <>
          <h5>Prodcuts under sale</h5>
        </>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="product-list">
          {displayProducts
            .filter((product) =>
              categoryId ? product.categoryid === categoryId : true
            )
            .filter((obj) => {
              if (params.get("type") === "sale") {
                return obj.discountpercent > 0;
              } else {
                return true;
              }
            })
            .map((product) => (
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
                    <p
                      style={
                        product.discountpercent > 0
                          ? { textDecorationLine: "line-through" }
                          : {}
                      }
                    >
                      <strong>Price:</strong> ${product.price}
                    </p>

                    {product.discountpercent > 0 && (
                      <div>
                        <p>
                          <strong>Sale Price:</strong> $
                          {product.salePrice.toFixed(2)}
                        </p>
                        <p>
                          <strong>Discount Percent: </strong>
                          {product.discountpercent} %
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
