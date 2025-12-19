import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("dashboard");
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: ""
  });
  const [editing, setEditing] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");

  const availableImages = [
    "/images/apple.jpg", "/images/banana.jpg", "/images/orange.jpg",
    "/images/carrot.jpg", "/images/milk.jpg", "/images/bread.jpg",
    "/images/tomato.jpg", "/images/potato.jpg", "/images/red_onion.jpg", "/images/strawberry.jpg",
    "/images/egg.jpg", "/images/chicken.jpg", "/images/fish.jpg",
    "/images/noimage.jpg"
  ];

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
    setProducts(res.data);
  };

  const loadOrders = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/orders`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setOrders(res.data);
  };

  const createProduct = async (e) => {
    e.preventDefault();
    await axios.post(
      `${process.env.REACT_APP_API_URL}/products`,
      {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        imageUrl: form.imageUrl || ""
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setForm({ name: "", price: "", stock: "", description: "", imageUrl: "" });
    loadProducts();
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    await axios.put(
      `${process.env.REACT_APP_API_URL}/products/${editing.id}`,
      {
        name: editing.name,
        price: Number(editing.price),
        stock: Number(editing.stock),
        description: editing.description,
        imageUrl: editing.imageUrl || ""
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditing(null);
    loadProducts();
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/products/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadProducts();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const totalRevenue = orders.reduce(
    (sum, o) =>
      sum +
      (o.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0),
    0
  );

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin</h2>
        <button onClick={() => setView("dashboard")}>Dashboard</button>
        <button onClick={() => setView("products")}>Products</button>
        <button onClick={() => setView("orders")}>Orders</button>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      {/* Main */}
      <div className="main-content">
        {view === "dashboard" && (
          <div className="stats-cards">
            <div className="card">
              <h3>Total Orders</h3>
              <p>{orders.length}</p>
            </div>
            <div className="card total-revenue">
              <h3>Total Revenue (€)</h3>
              <p>{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        )}

        {view === "products" && (
          <>
            <h2>Manage Products</h2>

            {/* Add / Edit Form */}
            <div className="product-form">
              <h3>{editing ? "Edit Product" : "Add Product"}</h3>

              <form onSubmit={editing ? saveEdit : createProduct}>
                <input
                  placeholder="Name"
                  value={editing ? editing.name : form.name}
                  onChange={e =>
                    editing
                      ? setEditing({ ...editing, name: e.target.value })
                      : setForm({ ...form, name: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Price (€/kg)"
                  value={editing ? editing.price : form.price}
                  onChange={e =>
                    editing
                      ? setEditing({ ...editing, price: e.target.value })
                      : setForm({ ...form, price: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={editing ? editing.stock : form.stock}
                  onChange={e =>
                    editing
                      ? setEditing({ ...editing, stock: e.target.value })
                      : setForm({ ...form, stock: e.target.value })
                  }
                  required
                />

                <input
                  placeholder="Description"
                  value={editing ? editing.description : form.description}
                  onChange={e =>
                    editing
                      ? setEditing({ ...editing, description: e.target.value })
                      : setForm({ ...form, description: e.target.value })
                  }
                  required
                />

                <select
                  value={editing ? editing.imageUrl || "" : form.imageUrl}
                  onChange={e =>
                    editing
                      ? setEditing({ ...editing, imageUrl: e.target.value })
                      : setForm({ ...form, imageUrl: e.target.value })
                  }
                >
                  <option value="">No Image</option>
                  {availableImages.map(img => (
                    <option key={img} value={img}>
                      {img.replace("/images/", "")}
                    </option>
                  ))}
                </select>

                <div className="form-actions">
                  <button type="submit">
                    {editing ? "Save Changes" : "Add Product"}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Product Table */}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th><th>Price / kg</th><th>Stock</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>€{p.price}</td>
                    <td>
                      {p.stock <= 5 ? (
                        <span className="badge low-stock">{p.stock} Low</span>
                      ) : p.stock}
                    </td>
                    <td>
                      <button onClick={() => setEditing(p)}>Edit</button>
                      <button onClick={() => removeProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {view === "orders" && (
          <>
            <h2>Orders</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>User</th><th>Date</th><th>Total</th><th>Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.user?.name ?? o.userId}</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                    <td>
                      €
                      {o.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="view-items-btn"
                        onClick={() => setSelectedOrder(o)}
                      >
                        View Items
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Items</h3>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Product</th><th>Price / kg</th><th>Qty</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map(i => (
                  <tr key={i.id}>
                    <td>{i.product?.name ?? "Unknown"}</td>
                    <td>€{i.price.toFixed(2)}</td>
                    <td>{i.quantity}</td>
                    <td>€{(i.price * i.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
