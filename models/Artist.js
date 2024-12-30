const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Artist = sequelize.define('Artist', {
  artist_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grammy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Artist;
