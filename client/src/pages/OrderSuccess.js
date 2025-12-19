import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import "./Common.css";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const found = res.data.find((o) => o.id === orderId);
        setOrder(found);
      });
  }, [orderId]);

  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="order-success-container">
      <h2>Thank you for your purchase!</h2>
      <p>Order ID: {order.id}</p>

      <table className="order-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price (€)</th>
            <th>Quantity</th>
            <th>Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item) => (
            <tr key={item.id}>
              <td>{item.product.name}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/home" className="back-home-btn">
        Back to Home
      </Link>
    </div>
  );
}
