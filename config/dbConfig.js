// Load environment variables from the .env file
require("dotenv").config();
const express = require("express");
const { Sequelize } = require('sequelize');


// Debugging line to print the DATABASE_URL
//console.log('DATABASE_URL:', process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Set to false for Render's self-signed certificates
    },
  },
  logging: false, // Optional: set to true for SQL query logging
});

module.exports = sequelize;
 