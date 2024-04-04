import React, { useContext, useState } from "react";
import { AppContext } from "./GlobalContextProvider";
import { useParams } from "react-router-dom";

const CheckoutForm = ({ onSubmit }) => {
  const { userId } = useContext(AppContext);
  const { subTotalPrice, tax, totalPrice } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  /*   console.log("cartItems are:", cartItems); */
  const handleSubmit = async (e) => {
    /*  console.log("GlobalcontextProvider.js line 20:", userId); */

    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      const paymentData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        userId,
      };
      //Backend call to stripe payments
      const response = await fetch("/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })
        .then((res) => {
          if (res.ok) return res.json();
          return res.json().then((json) => Promise.reject(json));
        })
        .then(({ url }) => {
          /* 
        console.log(url, "From Checkoutform js line 51"); */
          window.location = url;
        })
        .catch((e) => {
          console.log(e.errors);
        });
      console.log(response);
    } else {
      setFormErrors(errors);
    }
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(data.phoneNumber)) {
      errors.phoneNumber = "Phone number is invalid";
    }
    if (!data.address.trim()) {
      errors.address = "Address is required";
    }
    return errors;
  };

  return (
    <div>
      <div className="price-container">
        <h2>Order Summary</h2>
        <div>
          <span>
            <strong>SubTotal price:</strong>
          </span>
          <span>
            <strong>${subTotalPrice}</strong>
          </span>
        </div>
        <div>
          <span>
            <strong>Tax (13%):</strong>
          </span>
          <span>
            <strong>${tax}</strong>
          </span>
        </div>
        <div>
          <span>
            <strong>Total price: </strong>
          </span>
          <span>
            <strong>${totalPrice}</strong>
          </span>
        </div>
      </div>

      <div className="main-container">
        <div className="form-container">
          <h2>Checkout</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              <label htmlFor="fullName">Full Name:</label>
              <div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {formErrors.fullName && (
                  <span style={{ color: "red" }}>{formErrors.fullName}</span>
                )}
              </div>
            </div>

            <div className="form-fields">
              <label htmlFor="email">Email:</label>
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && (
                  <span style={{ color: "red" }}>{formErrors.email}</span>
                )}
              </div>
            </div>

            <div className="form-fields">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <div>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                {formErrors.phoneNumber && (
                  <span style={{ color: "red" }}>{formErrors.phoneNumber}</span>
                )}
              </div>
            </div>
            <h2>Shipping Address</h2>
            <div className="form-fields">
              <label htmlFor="address">Address:</label>
              <div>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {formErrors.address && (
                  <span style={{ color: "red" }}>{formErrors.address}</span>
                )}
              </div>
            </div>
            <div className="login-button">
              <button type="submit" onClick={handleSubmit}>
                Pay Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
