import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import "./Checkout.css";

const Checkout = () => {

  const { getTotalCartAmount, clearCart } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: ""
  });

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            zip: "",
            country: ""
        });
    };

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${backend_url}/confirm-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      alert("Order confirmed!");
      resetForm();
      clearCart();
    } catch (error) {
      alert("Failed to confirm order");
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="checkout-main">
        <div className="checkout">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            {["name", "email", "phone", "address", "city", "zip", "country"].map((field) => (
              <div className="form-group" key={field}>
                <div className="order-input-label">
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                </div>
                <div className="order-input">
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            ))}
            <button type="submit" className="checkout-btn">Proceed to Confirm</button>
          </form>
        </div>

        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>{currency}{getTotalCartAmount()}</h3>
            </div>
          </div>
        </div>
      </div>

      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Order</h3>
            <p>Are you sure you want to place this order?</p>
            <button onClick={confirmOrder} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Confirm Order"}
            </button>
            <button onClick={() => setShowModal(false)} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
