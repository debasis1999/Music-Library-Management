const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Album = sequelize.define('Album', {
  album_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Album;
