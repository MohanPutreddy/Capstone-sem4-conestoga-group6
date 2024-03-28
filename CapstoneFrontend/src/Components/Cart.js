import React, { useContext } from "react";
import axios from "axios";
import { AppContext } from "./GlobalContextProvider";
import { Link } from "react-router-dom";

const Cart = () => {
  const { reFetchCart, cartItems } = useContext(AppContext);

  const subTotalPrice = cartItems?.reduce((acc, item) => {
    const itemPrice = parseFloat(item.productdetails.price);
    const salePrice = parseFloat(item.productdetails.salePrice);
    const discountpercent = parseFloat(item.productdetails.discountpercent);
    const discountprice = discountpercent > 0 ? salePrice : itemPrice;
    const itemCount = item.count;
    return acc + discountprice * itemCount;
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

  return (
    <div className="container">
      <h2 className="mt-3 mb-4">Shopping Cart</h2>
      <div className="cart">
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
                  <p
                    style={
                      item.productdetails.discountpercent > 0
                        ? { textDecorationLine: "line-through" }
                        : {}
                    }
                  >
                    price: ${item.productdetails.price}
                  </p>

                  {item.productdetails.discountpercent > 0 && (
                    <div>
                      <p> Sale Price: ${item.productdetails.salePrice}</p>
                    </div>
                  )}
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
        <div className="price-container">
          <div>
            <span>
              <strong>SubTotal price:</strong>
            </span>
            <span>
              <strong>${subTotalPrice?.toFixed(2)}</strong>
            </span>
          </div>
          <div>
            <span>
              <strong>Tax (13%):</strong>
            </span>
            <span>
              {" "}
              <strong>${tax?.toFixed(2)}</strong>
            </span>
          </div>
          <div>
            <span>
              <strong>Total price: </strong>
            </span>
            <span>
              <strong>${totalPrice?.toFixed(2)}</strong>
            </span>
          </div>
          <Link
            to={`/checkout/${subTotalPrice}/${tax}/${totalPrice}`}
            className="btn btn-primary width100"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
