const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoriteController');

// Add a favorite
router.post('/favorites', favoritesController.addFavorite);

// Get all favorites for a user
router.get('/favorites/:user_id', favoritesController.getFavoritesByUser);

// Delete a favorite
router.delete('/favorites/:favorite_id', favoritesController.deleteFavorite);

module.exports = router;






// // routes/favoriteRoutes.js
// const express = require('express');
// const { Favorite } = require('../models');  // Assuming you have a Favorite model
// const router = express.Router();

// // Add an artist to favorites
// router.post('/artists/:artistId', async (req, res) => {
//   const { user_id } = req.user;  // Get the authenticated user's ID
//   const { artistId } = req.params;

//   try {
//     const favorite = await Favorite.create({ user_id, artist_id: artistId });
//     res.status(201).json(favorite);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding to favorites', error: error.message });
//   }
// });

// // Remove an artist from favorites
// router.delete('/artists/:artistId', async (req, res) => {
//   const { user_id } = req.user;  // Get the authenticated user's ID
//   const { artistId } = req.params;

//   try {
//     await Favorite.destroy({ where: { user_id, artist_id: artistId } });
//     res.status(200).json({ message: 'Removed from favorites' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error removing from favorites', error: error.message });
//   }
// });

// // Similar routes can be created for albums and tracks

// module.exports = router;
