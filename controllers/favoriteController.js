const Favorite = require('../models/Favorites');

// Create a new favorite
exports.addFavorite = async (req, res) => {
  const { user_id, favorite_type, favorite_id_ref } = req.body;
  try {
    const favorite = await Favorite.create({ user_id, favorite_type, favorite_id_ref });
    res.status(201).json({
      message: 'Favorite added successfully',
      data: favorite,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding favorite',
      error: error.message,
    });
  }
};

// Get all favorites for a user
exports.getFavoritesByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const favorites = await Favorite.findAll({ where: { user_id } });
    res.status(200).json({
      message: 'Favorites retrieved successfully',
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving favorites',
      error: error.message,
    });
  }
};

// Delete a favorite
exports.deleteFavorite = async (req, res) => {
  const { favorite_id } = req.params;
  try {
    const result = await Favorite.destroy({ where: { favorite_id } });
    if (result) {
      res.status(200).json({
        message: 'Favorite deleted successfully',
      });
    } else {
      res.status(404).json({
        message: 'Favorite not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting favorite',
      error: error.message,
    });
  }
};
