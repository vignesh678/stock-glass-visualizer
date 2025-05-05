
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'stockglass_jwt_secret';

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stockglass')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// Purchased Stock Schema
const PurchasedStockSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  stockId: {
    type: Number,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  targetPrice: {
    type: Number,
    default: null
  },
  currentPrice: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
});

const PurchasedStock = mongoose.model('PurchasedStock', PurchasedStockSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Protected route example
app.get('/api/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CRUD operations for purchased stocks
app.post('/api/portfolio', auth, async (req, res) => {
  try {
    const { stockId, symbol, name, purchasePrice, quantity, targetPrice, currentPrice } = req.body;
    
    const purchasedStock = new PurchasedStock({
      userId: req.user.id,
      stockId,
      symbol,
      name,
      purchasePrice,
      quantity,
      targetPrice,
      currentPrice
    });
    
    await purchasedStock.save();
    res.json(purchasedStock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/portfolio', auth, async (req, res) => {
  try {
    const purchasedStocks = await PurchasedStock.find({ userId: req.user.id });
    res.json(purchasedStocks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/portfolio/:id', auth, async (req, res) => {
  try {
    const { targetPrice, quantity, purchasePrice } = req.body;
    
    // Find stock and check if it belongs to user
    const purchasedStock = await PurchasedStock.findById(req.params.id);
    
    if (!purchasedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    if (purchasedStock.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update fields
    if (targetPrice !== undefined) purchasedStock.targetPrice = targetPrice;
    if (quantity !== undefined) purchasedStock.quantity = quantity;
    if (purchasePrice !== undefined) purchasedStock.purchasePrice = purchasePrice;
    
    await purchasedStock.save();
    res.json(purchasedStock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.delete('/api/portfolio/:id', auth, async (req, res) => {
  try {
    const purchasedStock = await PurchasedStock.findById(req.params.id);
    
    if (!purchasedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    if (purchasedStock.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await purchasedStock.remove();
    res.json({ message: 'Stock removed from portfolio' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Email notification endpoint
app.post('/api/notify/email', auth, async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    // In a real application, you would integrate with an email service here
    // For now we'll just log the notification
    console.log(`Email notification to ${email}: ${subject} - ${message}`);
    res.json({ success: true, message: 'Notification sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
