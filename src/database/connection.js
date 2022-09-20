const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL || "";

if (!MONGODB_URL) {
    throw new Error("please set db url through env variables");
}
 const db = mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // dbName: 'db-contacts',
  });
  mongoose.connection.on('connected', () => {
    console.log('Mongoose: Database connection successful.');
  });
  
  mongoose.connection.on('error', error => {
    console.log(`Mongoose: Error Database connection: ${error.message}.`);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose: Database connection terminated.');
  });
  process.on('SIGINT', async () => {
    mongoose.connection.close(() => {
      console.log('Database connection terminated.');
      process.exit(1);
    });
  });
  
  module.exports = db;