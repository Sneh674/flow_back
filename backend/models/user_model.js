const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URL);

// Regular expression for validating a 10-digit mobile number
const mobileRegex = /^[0-9]{10}$/;
// Regular expression for validating an email
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Regular expression for ensuring at least one letter (for name and email)
const atLeastOneLetterRegex = /[a-zA-Z]/;

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, match: atLeastOneLetterRegex },
    countrycode: { type: String, required: true, default: "91" },
    mobile: { type: String, required: true, unique: true, match: mobileRegex },
    email: { type: String, required: true, match: emailRegex },
    verifiedonce: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
