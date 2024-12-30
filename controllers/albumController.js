
const AppError = require('../utils/AppError'); // Utility for handling custom errors (optional)
//const sequelize = require('../config/dbConfig');
const Album  = require('../models/Album'); // Import the Album model


//Album.init({}, { sequelize, modelName: 'Album' });
console.log(Album);
// Create a new album
// const createAlbum = async (req, res, next) => {
//   try {
//     const { name, year, hidden } = req.body;

//     if (!name || !year) {
//       throw new AppError('Name and year are required', 400);
//     }

//     const newAlbum = await Album.create({ name, year, hidden });
//     res.status(201).json(newAlbum);
//   } catch (error) {
//     next(error);
//   }
// };



const createAlbum = async (req, res, next) => {
    try {
      const { name, year, hidden } = req.body;
      const newAlbum = await Album.create({ name, year, hidden });
      res.status(201).json(newAlbum);
    } catch (error) {
      next(error); // Pass the error to a global error handler
    }
  };

// Get all albums
const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.findAll();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

// Get a single album by ID
const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findByPk(id);

    if (!album) {
      throw new AppError('Album not found', 404);
    }

    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

// Update an album by ID
const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, year, hidden } = req.body;

    const album = await Album.findByPk(id);
    if (!album) {
      throw new AppError('Album not found', 404);
    }

    album.name = name || album.name;
    album.year = year || album.year;
    album.hidden = hidden !== undefined ? hidden : album.hidden;

    await album.save();
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

// Delete an album by ID
const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    const album = await Album.findByPk(id);
    if (!album) {
      throw new AppError('Album not found', 404);
    }

    await album.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

  

module.exports = {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,

};
