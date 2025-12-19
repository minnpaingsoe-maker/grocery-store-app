import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Common.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const { cartCount, fetchCartCount } = useContext(CartContext);

  // --------------------------------------------------
  // LOAD PRODUCTS
  // --------------------------------------------------
  const loadProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --------------------------------------------------
  // LOAD CART ITEMS
  // --------------------------------------------------
  const loadCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
        headers: { Authorization: "Bearer " + token }
      });

      setCartItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts();
    fetchCartCount();
    loadCartItems();
  }, []);

  // --------------------------------------------------
  // IMAGE HANDLER
  // --------------------------------------------------
  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/images")) return process.env.REACT_APP_API_URL + path;
    return process.env.REACT_APP_API_URL + "/" + path;
  };

  // --------------------------------------------------
  // ADD TO CART (STOCK SAFE)
  // --------------------------------------------------
  const addToCart = async (productId) => {
    const product = products.find(p => p.id === productId);
    const inCartQuantity =
      cartItems.find(item => item.productId === productId)?.quantity || 0;

    const availableStock = product.stock - inCartQuantity;

    if (availableStock <= 0) {
      alert("Sorry, this item is out of stock. Please try again later.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: "Bearer " + token } }
      );

      alert("Product added to cart!");
      fetchCartCount();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart.");
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <h2>Online Grocery Store</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="cart-btn" onClick={() => navigate("/cart")}>
            Cart ({cartCount})
          </button>

          <button className="cart-btn" onClick={() => navigate("/orders")}>
            My Orders
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* PRODUCTS */}
      <div className="products-grid">
        {products.map((p) => {
          const inCartQuantity =
            cartItems.find(item => item.productId === p.id)?.quantity || 0;

          const availableStock = p.stock - inCartQuantity;

          return (
            <div className="product-card" key={p.id}>
              {p.imageUrl ? (
                <img
                  src={resolveImageUrl(p.imageUrl)}
                  alt={p.name}
                  className="product-image"
                />
              ) : (
                <div className="product-no-image">No Image</div>
              )}

              <h3 className="product-name">{p.name}</h3>
              <p className="product-desc">{p.description}</p>
              <p className="product-price">€{p.price} / kg</p>

              <p className="product-stock">
                {availableStock > 0
                  ? `${availableStock} kg in stock`
                  : "Out of stock"}
              </p>

              <button
                className="add-cart-btn"
                disabled={availableStock <= 0}
                onClick={() => addToCart(p.id)}
                style={{
                  backgroundColor: availableStock <= 0 ? "#ccc" : "#4CAF50",
                  cursor: availableStock <= 0 ? "not-allowed" : "pointer",
                  color: availableStock <= 0 ? "#666" : "white"
                }}
              >
                {availableStock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
