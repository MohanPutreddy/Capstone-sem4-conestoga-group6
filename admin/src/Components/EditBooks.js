import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fetchAndDisplayImages = async (books, setDisplaybooks) => {
  const bookImages = [];
  for (const book of books) {
    try {
      const response = await axios.get(`https://6811-99-251-82-105.ngrok-free.app/uploads/${book.image}`, {
        responseType: 'blob', // set the response type to blob
        headers: {
          'Content-Type': 'image/jpeg',
          'ngrok-skip-browser-warning': '69420'
        }
      });
      
      // Read the image data as a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = () => {
        const base64Image = reader.result;
        bookImages.push({
          ...book,
          image: base64Image
        });
        setDisplaybooks([...bookImages]); // update the display books state
      };
    } catch (error) {
      console.error("Error fetching image:", error);
      bookImages.push(book);
      setDisplaybooks([...bookImages]); // update the display books state
    }
  }
};
export default function EditBooks() {
  const fileInput = useRef();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [book, setbook] = useState({});
  const [categories, setCategories] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://6811-99-251-82-105.ngrok-free.app/product/${productId}`, {
            headers: {
              'ngrok-skip-browser-warning': '69420'
            }
          }
        );
    
        const product = response.data.product;
        if (product.image) {
          const response = await axios.get(`https://6811-99-251-82-105.ngrok-free.app/uploads/${product.image}`, {
            responseType: 'blob',
            headers: {
              'Content-Type': 'image/jpeg',
              'ngrok-skip-browser-warning': '69420'
            }
          });
    
          const reader = new FileReader();
          reader.readAsDataURL(response.data);
          reader.onloadend = () => {
            setbook({
              ...product,
              image: reader.result
            });
            setLoading(false);
          };
        } else {
          setbook(product);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://6811-99-251-82-105.ngrok-free.app/category", {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        });
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (book.bookname?.trim() === "") {
      newErrors.bookname = "Book Name is required";
      isValid = false;
    }

    if (book.authorname?.trim() === "") {
      newErrors.authorname = "Author Name is required";
      isValid = false;
    }
    if (book.category?.trim() === "") {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (book.stock === "") {
      newErrors.stock = "Stock is required";
      isValid = false;
    } else if (isNaN(book.stock) || +book.stock < 0) {
      newErrors.stock = "Stock must be a non-negative number";
      isValid = false;
    }

    if (book.price === "") {
      newErrors.price = "Price is required";
      isValid = false;
    } else if (isNaN(book.price) || +book.price <= 0) {
      newErrors.price = "Price must be a positive number";
      isValid = false;
    }
    if (
      isNaN(book.discountpercent) ||
      +book.discountpercent < 0 ||
      +book.discountpercent > 100
    ) {
      newErrors.discountpercent =
        "discountpercent must be a positive number and less than 100";
      isValid = false;
    }
    if (book.description?.trim() === "") {
      newErrors.description = "Description is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      formData.append("bookname", book.bookname);
      formData.append("authorname", book.authorname);
      formData.append("price", book.price);
      formData.append("discountpercent", book.discountpercent);
      formData.append("description", book.description);
      formData.append("categoryid", book.categoryid);
      formData.append("stock", book.stock);
      formData.append("id", productId);
      formData.append("file", fileInput.current.files[0]);

      // formData.append("file", file.current.file);
      try {
        const response = await axios.put(
          "https://6811-99-251-82-105.ngrok-free.app/product/",
          formData, {
            headers: {
              'ngrok-skip-browser-warning': '69420'
            }
          }
        );
        if (response.data.status) {
          console.log("book is added", response.data);
          navigate("/displaybooks");
        } else {
          console.error("book is not added", response.data.message);
        }
      } catch (error) {
        console.error("error sending data:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setbook((prevBook) => ({
      ...prevBook,
      [name]: value,
      // SalePrice: book.discountpercent,
    }));
  };
  return (
    <div>
      <h1>Edit Book</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="edit-container">
          <div className="productImageContainer">
            <img
              src={book.image}
              alt={book.bookname}
              className="product-image"
            />
          </div>
          <>
            {
              <div className="main-container">
                <div className="form-container">
                  <h2>Add Book</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-fields">
                      <label htmlFor="bookname">Book Name:</label>
                      <div>
                        <input
                          type="text"
                          name="bookname"
                          value={book.bookname}
                          onChange={handleChange}
                        />
                        {errors.bookname && (
                          <p style={{ color: "red" }}>{errors.bookname}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-fields">
                      <label htmlFor="authorname">Author Name:</label>
                      <div>
                        <input
                          type="text"
                          name="authorname"
                          value={book.authorname}
                          onChange={handleChange}
                        />
                        {errors.authorname && (
                          <p style={{ color: "red" }}>{errors.authorname}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-fields">
                      <label htmlFor="price">Price:</label>
                      <div>
                        <input
                          type="text"
                          name="price"
                          value={book.price}
                          onChange={handleChange}
                        />
                        {errors.price && (
                          <p style={{ color: "red" }}>{errors.price}</p>
                        )}
                      </div>
                    </div>
                    <div className="form-fields">
                      <label htmlFor="discountpercent">Discount Percent:</label>
                      <div>
                        <input
                          type="text"
                          name="discountpercent"
                          value={book.discountpercent}
                          onChange={handleChange}
                        />
                        {errors.SalePrice && (
                          <p style={{ color: "red" }}>
                            {errors.discountpercent}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-fields">
                      <label htmlFor="description">Description:</label>
                      <div>
                        <textarea
                          name="description"
                          value={book.description}
                          onChange={handleChange}
                        />
                        {errors.description && (
                          <p style={{ color: "red" }}>{errors.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-fields">
                      <label htmlFor="file">Image URL: </label>
                      <div>
                        <input
                          type="file"
                          name="file"
                          ref={fileInput}
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div className="form-fields">
                      <label htmlFor="category">Category:</label>
                      <div>
                        <select
                          name="categoryid"
                          value={book.categoryid}
                          onChange={handleChange}
                        >
                          <option value="" disabled>
                            Select Category
                          </option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>

                        {errors.category && (
                          <p style={{ color: "red" }}>{errors.category}</p>
                        )}
                      </div>
                    </div>

                    <div className="form-fields">
                      <label htmlFor="stock">Stock:</label>
                      <div>
                        <input
                          type="text"
                          name="stock"
                          value={book.stock}
                          onChange={handleChange}
                        />
                        {errors.stock && (
                          <p style={{ color: "red" }}>{errors.stock}</p>
                        )}
                      </div>
                    </div>
                    <div className="add-books">
                      <button type="submit">Update Book</button>
                    </div>
                  </form>
                </div>
              </div>
            }
          </>
        </div>
      )}
    </div>
  );
}
