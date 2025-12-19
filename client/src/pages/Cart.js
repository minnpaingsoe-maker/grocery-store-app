import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import "./Common.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { cartCount, setCartCount, fetchCartCount } = useContext(CartContext);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(process.env.REACT_APP_API_URL + "/cart", {
        headers: { Authorization: "Bearer " + token },
      });
      setCartItems(res.data.items || []);
      setCartCount(res.data.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.error(err);
      alert("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        process.env.REACT_APP_API_URL + "/cart/remove",
        { productId },
        { headers: { Authorization: "Bearer " + token } }
      );
      alert(res.data.message || "Item removed");
      fetchCart();
      fetchCartCount(); // Update shared cartCount
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const checkout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        process.env.REACT_APP_API_URL + "/cart/checkout",
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      alert(res.data.message || "Checkout successful!");
      fetchCart();
      fetchCartCount(); // Update shared cartCount
      navigate("/home"); // Back to home
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Checkout failed");
    }
  };

  const resolveImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("/images")
      ? process.env.REACT_APP_API_URL + path
      : process.env.REACT_APP_API_URL + "/" + path;
  };

  return (
    <div className="cart-container">
      <header className="home-header">
        <h2>My Cart</h2>
        <div>
          <button className="cart-btn" onClick={() => navigate("/home")}>
            ⬅ Back to Home
          </button>
        </div>
      </header>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty</p>
      ) : (
        <div className="cart-grid">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={resolveImageUrl(item.product.imageUrl)}
                alt={item.product.name}
              />
              <div className="cart-info">
                <h3>{item.product.name}</h3>
                <p>Price: €{item.product.price} / kg</p>
                <p>Quantity: {item.quantity} kg</p>
                <p>Stock left: {item.product.stock - item.quantity} kg</p>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                style={{
                backgroundColor: "#1307f7ff",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.15)",
                transition: "0.25s",
                }}
              >
              Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "5px" }}
            onClick={checkout}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
