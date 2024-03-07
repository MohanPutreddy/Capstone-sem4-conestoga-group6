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
          "http://localhost:3000/category",
          category
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
    <div>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
        </div>
        {error.name && <p style={{ color: "red" }}>{error.name}</p>}
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
