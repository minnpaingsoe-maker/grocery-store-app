import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Common.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${process.env.REACT_APP_API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(console.error);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="my-orders-container">
        <h2>My Orders</h2>
        <p>No orders yet.</p>
        <button className="home-btn" onClick={() => navigate("/home")}>
          ⬅ Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      {/* HEADER */}
      <div className="orders-header">
        <h2>🧾 My Orders</h2>
        <button className="home-btn" onClick={() => navigate("/home")}>
          ⬅ Back to Home
        </button>
      </div>

      {orders.map((order) => {
        const orderTotal = Array.isArray(order.items)
          ? order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
          : 0;

        return (
          <div key={order.id} className="order-card">
            {/* ORDER META */}
            <div className="order-meta">
              <span>
                <strong>Order ID:</strong> #{order.id}
              </span>
              <span>
                <strong>Order Date:</strong>{" "}
                {formatDate(order.createdAt)}
              </span>
            </div>

            {/* TABLE */}
            <table className="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price (€)</th>
                  <th>Quantity</th>
                  <th>Line Total (€)</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(order.items) &&
                  order.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product?.name ?? "Unknown"}</td>
                      <td>{item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* ORDER TOTAL */}
            <div className="order-total">
              Order Total: €{orderTotal.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
