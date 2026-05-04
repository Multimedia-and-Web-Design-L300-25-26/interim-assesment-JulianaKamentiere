require('dotenv').config();
const mongoose = require('mongoose');
const Crypto = require('./models/Crypto');

const cryptoData = [
  { name: 'Bitcoin', symbol: 'BTC', price: 65000, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/btc.png', change24h: 2.5 },
  { name: 'Ethereum', symbol: 'ETH', price: 3200, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/eth.png', change24h: -1.2 },
  { name: 'BNB', symbol: 'BNB', price: 450, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/bnb.png', change24h: 3.8 },
  { name: 'Solana', symbol: 'SOL', price: 145, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/sol.png', change24h: 5.2 },
  { name: 'XRP', symbol: 'XRP', price: 2.3, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/xrp.png', change24h: -0.5 },
  { name: 'Cardano', symbol: 'ADA', price: 0.92, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/ada.png', change24h: 1.3 },
  { name: 'Dogecoin', symbol: 'DOGE', price: 0.35, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/doge.png', change24h: 4.1 },
  { name: 'Polkadot', symbol: 'DOT', price: 8.5, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/dot.png', change24h: 2.7 },
  { name: 'Litecoin', symbol: 'LTC', price: 950, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/ltc.png', change24h: 1.8 },
  { name: 'Avalanche', symbol: 'AVAX', price: 32, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/avax.png', change24h: 6.2 },
  { name: 'Chainlink', symbol: 'LINK', price: 16.5, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/link.png', change24h: -2.1 },
  { name: 'Uniswap', symbol: 'UNI', price: 10.2, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/uni.png', change24h: 3.5 },
  { name: 'Cosmos', symbol: 'ATOM', price: 12.4, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/atom.png', change24h: 7.9 },
  { name: 'Stellar', symbol: 'XLM', price: 0.28, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/xlm.png', change24h: -1.5 },
  { name: 'Ethereum Classic', symbol: 'ETC', price: 32, image: 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/32/color/etc.png', change24h: 2.3 },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    // Clear existing cryptos
    await Crypto.deleteMany({});
    console.log('Cleared existing cryptocurrencies');

    // Insert new cryptos
    await Crypto.insertMany(cryptoData);
    console.log(`✅ Seeded ${cryptoData.length} cryptocurrencies`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
