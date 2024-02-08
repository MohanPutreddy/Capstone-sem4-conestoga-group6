import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const nagivate = useNavigate();
  const intialBook = {
    bookname: "",
    authorname: "",
    price: "",
    description: "",
    image: "",
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

    if (book.image.trim() === "") {
      newErrors.image = "Image URL is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Book added:", book);
      nagivate("/displaybooks");
    } else {
      console.log("Form validation failed");
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
          <label>
            Book Name:
            <input
              type="text"
              name="bookname"
              value={book.bookname}
              onChange={handleChange}
            />
            {errors.bookname && (
              <p style={{ color: "red" }}>{errors.bookname}</p>
            )}
          </label>
        </div>

        <div>
          <label>
            Author Name:
            <input
              type="text"
              name="authorname"
              value={book.authorname}
              onChange={handleChange}
            />
            {errors.authorname && (
              <p style={{ color: "red" }}>{errors.authorname}</p>
            )}
          </label>
        </div>

        <div>
          <label>
            Price:
            <input
              type="text"
              name="price"
              value={book.price}
              onChange={handleChange}
            />
            {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
          </label>
        </div>

        <div>
          <label>
            Description:
            <textarea
              name="description"
              value={book.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p style={{ color: "red" }}>{errors.description}</p>
            )}
          </label>
        </div>

        <div>
          <label>
            Image URL:
            <input
              type="text"
              name="image"
              value={book.image}
              onChange={handleChange}
            />
            {errors.image && <p style={{ color: "red" }}>{errors.image}</p>}
          </label>
        </div>

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}
