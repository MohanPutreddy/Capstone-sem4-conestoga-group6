import React from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "./GlobalContextProvider";

export default function Cart() {
  const { reFetchCart, cartItems } = useContext(AppContext);

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${id}`);
      reFetchCart();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleItemCount = async (id, count, itemId) => {
    try {
      await axios.get(`http://localhost:3000/cart/${id}/${count}`);
      reFetchCart();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems?.length > 0 ? (
        cartItems?.map((item) => (
          <div key={item.id}>
            <img
              src={`http://localhost:3000/uploads/${item.productdetails.image}`}
              alt={item.productdetails.bookname}
            />
            <p>Book Name: {item.productdetails.bookname}</p>

            <button onClick={() => deleteItem(item.id)}>Delete </button>
            <br></br>
            <button
              onClick={() =>
                handleItemCount(item.productdetails.id, item.count - 1, item.id)
              }
            >
              -
            </button>
            {item.count}
            <button
              onClick={() =>
                handleItemCount(item.productdetails.id, item.count + 1, item.id)
              }
            >
              +
            </button>
          </div>
        ))
      ) : (
        <p>Cart is empty</p>
      )}
    </div>
  );
}
