const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');
//const User = require('./User');
const Artist = require('../models/artist');
// Add other models as needed

// Initialize models
//User.init({}, { sequelize, modelName: 'User' });
Artist.init({}, { sequelize, modelName: 'Artist' });

module.exports = {
  sequelize,
  Artist,
};
