import React, { useContext } from "react";
import axios from "axios";
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
    <div className="container">
      <h2 className="mt-3 mb-4">Shopping Cart</h2>
      <div className="cart-container">
        {cartItems?.length > 0 ? (
          cartItems?.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={`http://localhost:3000/uploads/${item.productdetails.image}`}
                alt={item.productdetails.bookname}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <p className="cart-item-name">
                  Book Name: {item.productdetails.bookname}
                </p>
                <div className="cart-item-buttons">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="delete-btn btn btn-danger"
                  >
                    Delete
                  </button>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        handleItemCount(
                          item.productdetails.id,
                          item.count - 1,
                          item.id
                        )
                      }
                      className="btn btn-secondary"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.count}</span>
                    <button
                      onClick={() =>
                        handleItemCount(
                          item.productdetails.id,
                          item.count + 1,
                          item.id
                        )
                      }
                      className="btn btn-secondary"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Cart is empty</p>
        )}
      </div>
    </div>
  );
}
