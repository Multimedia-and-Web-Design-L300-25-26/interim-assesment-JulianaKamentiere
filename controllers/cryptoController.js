const Crypto = require('../models/Crypto');

const getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    res.json({ data: cryptos });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find().sort({ change24h: -1 });
    res.json({ data: gainers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getNewListings = async (req, res) => {
  try {
    const newListings = await Crypto.find().sort({ createdAt: -1 });
    res.json({ data: newListings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addCrypto = async (req, res) => {
  const { name, symbol, price, image, change24h } = req.body;
  try {
    const existingCrypto = await Crypto.findOne({ symbol });
    if (existingCrypto) {
      return res.status(400).json({ message: 'Cryptocurrency with this symbol already exists' });
    }
    const crypto = new Crypto({ name, symbol, price, image, change24h });
    await crypto.save();
    res.status(201).json({ message: 'Cryptocurrency added successfully', data: crypto });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllCryptos, getGainers, getNewListings, addCrypto };