const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// ---------------------------------------------------------
// GET CART
// ---------------------------------------------------------
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
        include: {
          items: { include: { product: true } }
        }
      });
    }

    res.json(cart);
  } catch (err) {
    console.error("ERROR IN GET CART:", err);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

// ---------------------------------------------------------
// ADD TO CART
// ---------------------------------------------------------
exports.add = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await db.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await db.cart.create({ data: { userId } });
    }

    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.stock < quantity) {
      return res.status(400).json({
        message: "Not enough stock available"
      });
    }

    let item = await db.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (item) {
      if (item.quantity + quantity > product.stock) {
        return res.status(400).json({
          message: "Exceeds available stock"
        });
      }

      item = await db.cartItem.update({
        where: { id: item.id },
        data: { quantity: item.quantity + quantity }
      });
    } else {
      item = await db.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      });
    }

    res.json({ message: "Item added", item });
  } catch (err) {
    console.error("ERROR ADDING ITEM:", err);
    res.status(500).json({ message: "Failed to add item" });
  }
};

// ---------------------------------------------------------
// REMOVE FROM CART
// ---------------------------------------------------------
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await db.cart.findUnique({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await db.cartItem.deleteMany({
      where: { cartId: cart.id, productId }
    });

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("ERROR REMOVING ITEM:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// ---------------------------------------------------------
// CHECKOUT + CREATE ORDER
// ---------------------------------------------------------
exports.checkoutCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const order = await db.$transaction(async (tx) => {
      // 1️⃣ Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice
        }
      });

      // 2️⃣ Create order items + reduce stock
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(
            `Not enough stock for ${item.product.name}`
          );
        }

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      // 3️⃣ Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    res.json({
      message: "Checkout successful!",
      orderId: order.id
    });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    res.status(500).json({
      message: err.message || "Checkout failed"
    });
  }
};

