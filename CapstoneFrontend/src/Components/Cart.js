import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "./GlobalContextProvider";
import CheckoutForm from "./CheckoutForm";

const Cart = () => {
  const { reFetchCart, cartItems } = useContext(AppContext);

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const subTotalPrice = cartItems?.reduce((acc, item) => {
    const itemPrice = parseFloat(item.productdetails.price);
    const itemCount = item.count;
    return acc + itemPrice * itemCount;
  }, 0);

  const tax = subTotalPrice * 0.13;
  const totalPrice = subTotalPrice + tax;

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${id}`);
      reFetchCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleItemCount = async (id, count, itemId) => {
    if (count > 0) {
      try {
        await axios.get(`http://localhost:3000/cart/${id}/${count}`);
        reFetchCart();
      } catch (error) {
        console.error("Error updating item count:", error);
      }
    }
  };

  const handleCheckoutClick = () => {
    setShowCheckoutForm(true);
  };

  return (
    <div className="container">
      <h2 className="mt-3 mb-4">Shopping Cart</h2>
      <p>SubTotal price: ${subTotalPrice?.toFixed(2)}</p>
      <p>Tax (13%): ${tax?.toFixed(2)}</p>
      <p>Total price: ${totalPrice?.toFixed(2)}</p>
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
                <p> price: ${item.productdetails.price}</p>
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
      <button onClick={handleCheckoutClick} className="btn btn-primary">
        Checkout
      </button>
      {showCheckoutForm && <CheckoutForm />}
    </div>
  );
};

export default Cart;
