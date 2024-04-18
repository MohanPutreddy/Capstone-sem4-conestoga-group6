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
        const response = await axios.get("https://6811-99-251-82-105.ngrok-free.app/product/", {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        });
        setProducts(response.data?.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
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
  
      const updatedProducts = await Promise.all(result.map(async (product) => {
        const response = await axios.get(`https://6811-99-251-82-105.ngrok-free.app/uploads/${product.image}`, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'image/jpeg',
            'ngrok-skip-browser-warning': '69420'
          }
        });
        const imageUrl = URL.createObjectURL(response.data);
        return { ...product, imageUrl };
      }));
  
      setDisplayProducts(updatedProducts);
    };
  
    fetchImages();
  }, [products, searchQuery, sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete("https://6811-99-251-82-105.ngrok-free.app/product/", {
        data: { id },
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      window.location.reload();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="ProductsComponent">
      <h1 className="partition-text">Books</h1>

      <div className="searchAndSortComponent">
        <input
          className="form-control"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
        <ul className="product-list">
          {displayProducts.map((product) => (
            <div className="productImageContainer" key={product.id}>
              <li className="product-card">
                <div className="thumbnail">
                  <img
                    src={product.imageUrl}
                    alt={product.bookname}
                    className="img-thumbnail"
                  />
                </div>
                <div>
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
                        {product.discountpercent}%
                      </p>
                    </div>
                  )}
                </div>
                <div className="action-buttons">
                  <Link to={`/edit/${product.id}`}>
                    <button className="edit-button">Edit</button>
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="delete-button"
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
