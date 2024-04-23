const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Call the function to connect to the database
connectToDatabase(); //this needs to be inside your index.js where you connect the bot. so you make the connection the moment you run the bot. Maybe this helps

// Function to get user balance
async function getBalance(userId) {
  const usersCollection = client.db().collection('users');
  const user = await usersCollection.findOne({ _id: userId });
  return user ? user.balance : 0;
}

// Function to add currency to user
async function addCurrency(userId, amount) {
  const usersCollection = client.db().collection('users');
  await usersCollection.updateOne(
    { _id: userId },
    { $inc: { balance: amount } },
    { upsert: true }
  );
}

// Function to deduct currency from user
async function deductCurrency(userId, amount) {
  const usersCollection = client.db().collection('users');
  const user = await usersCollection.findOne({ _id: userId });

  if (user && user.balance >= amount) {
    await usersCollection.updateOne(
      { _id: userId },
      { $inc: { balance: -amount } }
    );
    return true; // Deduction successful
  }

  return false; // Insufficient balance
}

module.exports = {
  getBalance,
  addCurrency,
  deductCurrency
};
