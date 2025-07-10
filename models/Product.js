const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  type: String,
  height: String,
  soleType: String,
  eyelets: Number,
  material: String,
  thread: String,
  features: [String],
  wholesalePrice: Number,
  retailPrice: Number,
  imageUrl: String,
  category: String,
});

module.exports = mongoose.model('Product', productSchema);
