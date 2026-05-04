const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  change24h: { type: Number, required: true } // e.g., 2.5 for +2.5%
}, { timestamps: true });

module.exports = mongoose.model('Crypto', cryptoSchema);