const express = require('express');
const { Artist } = require('../controllers/artistController');
//const { Artist } = require('../controllers/artistController'); // Adjust if your models file is named differently
const router = express.Router();

// Create a new artist
router.post('/', async (req, res) => {
  try {
    const { name, grammy, hidden } = req.body;
    const artist = await Artist.create({ name, grammy, hidden });
    res.status(201).json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Error creating artist' });
  }
});

// Get all artists
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching artists' });
  }
});

// Update an artist
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grammy, hidden } = req.body;
    const artist = await Artist.findByPk(id);

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    artist.name = name ?? artist.name;
    artist.grammy = grammy ?? artist.grammy;
    artist.hidden = hidden ?? artist.hidden;

    await artist.save();
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Error updating artist' });
  }
});

// Delete an artist
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    await artist.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting artist' });
  }
});

module.exports = router;





// // routes/artistRoutes.js
// const express = require('express');
// const { Artist } = require('../models');
// const { isAdmin } = require('../middleware/roleMiddleware');
// const router = express.Router();

// // Create a new artist (Admins only)
// router.post('/', isAdmin, async (req, res) => {
//   try {
//     const { name, bio } = req.body;
//     const newArtist = await Artist.create({ name, bio });
//     res.status(201).json(newArtist);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating artist', error: error.message });
//   }
// });

// // Get all artists
// router.get('/', async (req, res) => {
//   try {
//     const artists = await Artist.findAll();
//     res.status(200).json({ data: artists });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching artists', error: error.message });
//   }
// });

// // Update an artist (Admins only)
// router.put('/:id', isAdmin, async (req, res) => {
//   const { id } = req.params;
//   const { name, bio } = req.body;

//   try {
//     const artist = await Artist.findByPk(id);
//     if (!artist) {
//       return res.status(404).json({ message: 'Artist not found' });
//     }

//     artist.name = name || artist.name;
//     artist.bio = bio || artist.bio;
//     await artist.save();
//     res.status(200).json(artist);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating artist', error: error.message });
//   }
// });

// // Delete an artist (Admins only)
// router.delete('/:id', isAdmin, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const artist = await Artist.findByPk(id);
//     if (!artist) {
//       return res.status(404).json({ message: 'Artist not found' });
//     }

//     await artist.destroy();
//     res.status(200).json({ message: 'Artist deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting artist', error: error.message });
//   }
// });

// module.exports = router;
