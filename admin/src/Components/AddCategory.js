import React, { useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const initialCategory = {
    name: "",
  };
  const [category, setCategory] = useState(initialCategory);
  const [error, setError] = useState("");

  const validateCategory = () => {
    let isValid = true;
    const newErrors = {};

    if (category.name.trim() === "") {
      newErrors.name = "Category is required";
      isValid = false;
    }
    setError(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateCategory()) {
      try {
        const response = await axios.post(
          "https://6811-99-251-82-105.ngrok-free.app/category",
          category, {
            headers: {
              'ngrok-skip-browser-warning': '69420'
            }
          }
        );
        if (response.data.status) {
          console.log("category is added", response.data);
          setCategory(initialCategory);
        } else {
          console.error("category is not added", response.data.message);
        }
      } catch (error) {
        console.error("error sending data:", error);
      }
    }
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <h2>Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-fields">
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
            />
          </div>
          {error.name && <p style={{ color: "red" }}>{error.name}</p>}
          <div className="login-button">
            <button type="submit">Add Category</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
