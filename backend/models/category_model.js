const mongoose = require('mongoose');
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URL);

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true }, // Amount of the transaction
  date: { type: Date, default: Date.now }, // Date and time of the transaction
  note: { type: String }, // Optional note about the transaction
});

// SubCategory Schema
const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Sub-category name (e.g., "Salary", "Petrol")
  description: { type: String, required: true }, // Description for inflow or outflow
  budget: { type: Number }, // Budget (applicable only for outflow)
  transactions: [TransactionSchema], // Array of transactions
});

// Cash Flow Schema
const CashFlowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Link to User
  type: { 
    type: String, 
    enum: ['inflow', 'outflow', 'savings'], 
    required: true 
  },
  subCategories: [SubCategorySchema], // Array of sub-categories
});

module.exports = mongoose.model('CashFlow', CashFlowSchema);