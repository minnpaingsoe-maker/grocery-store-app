const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

// ========================
// GET ALL PRODUCTS
// ========================
exports.getAll = async (req, res) => {
  try {
    const products = await db.product.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to load products" });
  }
};

// ========================
// CREATE PRODUCT (Admin Only)
// ========================
exports.create = async (req, res) => {
  try {
    const { name, price, description, imageUrl, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const product = await db.product.create({
      data: {
        name,
        price: Number(price),
        description: description || "",
        imageUrl: imageUrl || "",
        stock: Number(stock) || 0
      }
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// ========================
// UPDATE PRODUCT (Admin Only)
// ========================
exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, price, stock, description, imageUrl } = req.body;

    const updated = await db.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        description,
        imageUrl
      }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// ========================
// DELETE PRODUCT (Admin Only)
// ========================
exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await db.product.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
