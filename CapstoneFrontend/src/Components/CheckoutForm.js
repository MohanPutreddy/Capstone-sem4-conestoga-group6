import React, { useState } from "react";

const CheckoutForm = ({ onSubmit }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      console.log(formData);
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
    if (!data.cardNumber.trim()) {
      errors.cardNumber = "Card number is required";
    }
    if (!data.expiryDate.trim()) {
      errors.expiryDate = "Expiry date is required";
    }
    if (!data.cvv.trim()) {
      errors.cvv = "CVV is required";
    }
    return errors;
  };

  return (
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

          <div className="form-fields">
            <label htmlFor="cardNumber">Card Number:</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
            />
            {formErrors.cardNumber && (
              <span style={{ color: "red" }}>{formErrors.cardNumber}</span>
            )}
          </div>

          <div className="form-fields">
            <label htmlFor="expiryDate">Expiry Date:</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
            />
            {formErrors.expiryDate && (
              <span style={{ color: "red" }}>{formErrors.expiryDate}</span>
            )}
          </div>

          <div className="form-fields">
            <label htmlFor="cvv">CVV:</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
            />
            {formErrors.cvv && (
              <span style={{ color: "red" }}>{formErrors.cvv}</span>
            )}
          </div>

          <div className="login-button">
            <button type="submit">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
