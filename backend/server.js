import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import Product from './models/Product.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', apiRoutes);

// Seed Products (run once)
const seedProducts = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      const mockProducts = [
        { name: 'Wireless Headphones', price: 79.99, image: '🎧', description: 'Premium sound quality' },
        { name: 'USB-C Cable', price: 12.99, image: '🔌', description: 'Fast charging cable' },
        { name: 'Phone Stand', price: 19.99, image: '📱', description: 'Adjustable phone holder' },
        { name: 'Portable Charger', price: 34.99, image: '🔋', description: '20000mAh capacity' },
        { name: 'Screen Protector', price: 9.99, image: '🛡️', description: 'Tempered glass' },
        { name: 'Laptop Cooling Pad', price: 44.99, image: '❄️', description: 'Dual fan system' },
        { name: 'Wireless Mouse', price: 29.99, image: '🖱️', description: 'Ergonomic design' },
        { name: 'Desk Lamp', price: 39.99, image: '💡', description: 'LED brightness control' }
      ];

      await Product.insertMany(mockProducts);
      console.log('Products seeded successfully');
    }else {
      console.log('Products already exist, skipping seeding');
    }
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

seedProducts();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});