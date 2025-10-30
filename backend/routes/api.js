import express from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

const router = express.Router();

//Fetch all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Fetch cart by cartId
router.get('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let cart = await Cart.findOne({ cartId: id });
    
    if (!cart) {
      cart = new Cart({ cartId: id, items: [], total: 0 });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Add item to cart
router.post('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, qty } = req.body;

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ cartId: id });
    if (!cart) {
      cart = new Cart({ cartId: id, items: [], total: 0 });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += parseInt(qty);
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: parseInt(qty),
        image: product.image
      });
    }

    // Calculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.updatedAt = new Date();

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Remove item from cart
router.delete('/cart/:cartId/:productId', async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.updatedAt = new Date();

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Update quantity
router.put('/cart/:cartId/:productId', async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { qty } = req.body;

    const cart = await Cart.findOne({ cartId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(
      item => item.productId.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (qty <= 0) {
      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );
    } else {
      item.quantity = parseInt(qty);
    }

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.updatedAt = new Date();

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Create order
router.post('/checkout', async (req, res) => {
  try {
    const { cartItems, email, name, cartId } = req.body;

    if (!cartItems || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      name,
      email,
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      status: 'completed'
    });

    await order.save();

    // Clear cart
    if (cartId) {
      await Cart.updateOne(
        { cartId },
        { items: [], total: 0, updatedAt: new Date() }
      );
    }

    res.json({
      id: order._id,
      name: order.name,
      email: order.email,
      items: order.items,
      total: order.total,
      timestamp: order.createdAt,
      status: order.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;