import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddBook() {
  const fileInput = useRef();

  const navigate = useNavigate();
  const intialBook = {
    bookname: "",
    authorname: "",
    price: "",
    discountpercent: "",
    description: "",
    categoryid: "",
    stock: "",
  };
  const [book, setBook] = useState(intialBook);
  const [categories, setCategories] = useState([]);

  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_NGROK_URL}/category`, {
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

    if (book.stock?.trim() === "") {
      newErrors.stock = "Stock is required";
      isValid = false;
    } else if (isNaN(book.stock) || +book.stock < 0) {
      newErrors.stock = "Stock must be a non-negative number";
      isValid = false;
    }

    if (book.price?.trim() === "") {
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
      formData.append("file", fileInput.current.files[0]);

      // formData.append("file", file.current.file);
      try {
        const response = await axios.post(`${process.env.REACT_APP_NGROK_URL}/product`,
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

    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };
  return (
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
              {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
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
              {errors.discountpercent && (
                <p style={{ color: "red" }}>{errors.discountpercent}</p>
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
                accept="image/*" /* 
                class="form-control" */
                required
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
              {errors.stock && <p style={{ color: "red" }}>{errors.stock}</p>}
            </div>
          </div>
          <div className="add-books">
            <button type="submit">Add Book</button>
          </div>
        </form>
      </div>
    </div>
  );
}
