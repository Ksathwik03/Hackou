const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  product_name : {
      type: String,
      required: true
  },
  product_link: {
    type: String,
    required: true
  },
  chat_id: {
      type: String,
      default: ""
  },
  bank: {
    type: String,
    required: true
  },
  dealStatus: {
    type: Boolean,
    default: false
  },
  admin_details: {
    type: Array,
  }
},{ timestamps: true });


const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;