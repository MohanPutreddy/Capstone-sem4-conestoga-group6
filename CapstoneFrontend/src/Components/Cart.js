import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AppContext } from "./GlobalContextProvider";
import { Link } from "react-router-dom";

const Cart = () => {
  const { reFetchCart, cartItems } = useContext(AppContext);
  const [displayItems, setDisplayItems] = useState([]);
  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchAndDisplayImages = async () => {
      const updatedItems = [];
      for (const item of cartItems) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_NGROK_URL}/uploads/${item.productdetails.image}`, {
            responseType: 'blob', // set the response type to blob
            headers: {
              'Content-Type': 'image/jpeg',
              'ngrok-skip-browser-warning': '69420'
            }
          });

          // Convert blob to base64 URL
          const reader = new FileReader();
          reader.readAsDataURL(response.data);
          reader.onloadend = () => {
            const base64Image = reader.result;
            updatedItems.push({
              ...item,
              productdetails: {
                ...item.productdetails,
                image: base64Image
              }
            });
            setDisplayItems([...updatedItems]);
          };
        } catch (error) {
          console.error("Error fetching image:", error);
          updatedItems.push(item);
          setDisplayItems([...updatedItems]);
        }
      }
    };

    fetchAndDisplayImages();
  }, [cartItems]);

  useEffect(() => {
    // Calculate subtotal price
    const subtotal = displayItems.reduce((acc, item) => {
      const itemPrice = parseFloat(item.productdetails.price);
      const salePrice = parseFloat(item.productdetails.salePrice);
      const discountpercent = parseFloat(item.productdetails.discountpercent);
      const discountprice = discountpercent > 0 ? salePrice : itemPrice;
      const itemCount = item.count;
      return acc + discountprice * itemCount;
    }, 0);
    setSubTotalPrice(subtotal);

    // Calculate tax (assuming 13%)
    const taxAmount = subtotal * 0.13;
    setTax(taxAmount);

    // Calculate total price
    const totalPrice = subtotal + taxAmount;
    setTotalPrice(totalPrice);
  }, [displayItems]);

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_NGROK_URL}/cart/${id}`, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      reFetchCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleItemCount = async (id, count, itemId) => {
    if (count > 0) {
      try {
        await axios.get(`${process.env.REACT_APP_NGROK_URL}/cart/${id}/${count}`, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        });
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
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.productdetails.image}
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
