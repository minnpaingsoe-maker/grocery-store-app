const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// For admin page
exports.getAllOrders = async (req, res) => {
  try {
    // Optional: check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        user: true, // Include user info
      },
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get cart items for this user
    const cartItems = await db.cartItem.findMany({
      where: { cart: { userId } },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create order
    const order = await db.order.create({
      data: { userId },
    });

    // Create order items and reduce stock
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${item.product.name}` });
      }

      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });

      // Reduce stock
      await db.product.update({
        where: { id: item.productId },
        data: { stock: item.product.stock - item.quantity },
      });
    }

    // Clear cart
    await db.cartItem.deleteMany({ where: { cart: { userId } } });

    res.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  }
};

// Get all orders of the logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
