const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Album = require('./Album'); // Example if you want to associate with Album

const Track = sequelize.define('Track', {
  track_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // Store duration in seconds
    allowNull: false,
  },
  hidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

}, {
  // Optional configuration
  timestamps: true,
});

// Example association if the track belongs to an album
Track.belongsTo(Album, { foreignKey: 'album_id' });
Album.hasMany(Track, { foreignKey: 'album_id' });
console.log(Track);
module.exports = Track;
