require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const path = require('path')

const currentDir= path.resolve();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//production
if(process.env.NODE_ENV === "production"){
	app.use(express.static(path.join(currentDir,"/client/dist")));
	app.get("*",(req,res)=>{
		res.sendFile(path.resolve(currentDir,"client","dist","index.html"));
	})
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});