const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Favorite = sequelize.define('Favorite', {
  favorite_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  favorite_type: {
    type: DataTypes.ENUM('Artist', 'Album', 'Track'),
    allowNull: false,
  },
  favorite_id_ref: {
    type: DataTypes.UUID, // Reference to Artist, Album, or Track
    allowNull: false,
  },
});

module.exports = Favorite;
