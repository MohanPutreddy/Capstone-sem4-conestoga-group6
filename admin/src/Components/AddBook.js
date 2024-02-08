import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddBook() {
  const fileInput = useRef();

  const navigate = useNavigate();
  const intialBook = {
    bookname: "",
    authorname: "",
    price: "",
    description: "",
  };
  const [book, setBook] = useState(intialBook);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (book.bookname.trim() === "") {
      newErrors.bookname = "Book Name is required";
      isValid = false;
    }

    if (book.authorname.trim() === "") {
      newErrors.authorname = "Author Name is required";
      isValid = false;
    }

    if (book.price.trim() === "") {
      newErrors.price = "Price is required";
      isValid = false;
    } else if (isNaN(book.price) || +book.price <= 0) {
      newErrors.price = "Price must be a positive number";
      isValid = false;
    }

    if (book.description.trim() === "") {
      newErrors.description = "Description is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Book added:", book);
      const formData = new FormData();
      formData.append("bookname", book.bookname);
      formData.append("authorname", book.authorname);
      formData.append("price", book.price);
      formData.append("description", book.description);
      formData.append("file", fileInput.current.files[0]);

      // formData.append("file", file.current.file);
      try {
        const response = await axios.post(
          "http://localhost:3000/product/insert",
          formData
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
    <div>
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bookname">Book Name:</label>
          <input
            type="text"
            name="bookname"
            value={book.bookname}
            onChange={handleChange}
          />
          {errors.bookname && <p style={{ color: "red" }}>{errors.bookname}</p>}
        </div>

        <div>
          <label htmlFor="authorname">Author Name:</label>
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

        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            name="price"
            value={book.price}
            onChange={handleChange}
          />
          {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            value={book.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="file">Image URL: </label>
          <input
            type="file"
            name="file"
            ref={fileInput}
            accept="image/*"
            required
          />
        </div>

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}
