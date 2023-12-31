const mongoose = require("mongoose");

const customerUserData = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  block: {
    type: Boolean,
    required: true,
    default:false
  },
  addresses: [
    {
      building: String,
      mobileNumber: Number,
      pinCode: Number,
      city: String,
      state: String,
      address:String,
      alternativePhoneNumber:Number,
      primary:Boolean,
    },
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
  coupponsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
});

const userData =  mongoose.model("signupUserDetails", customerUserData);

module.exports = userData;
