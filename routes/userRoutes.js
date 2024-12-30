const express = require('express');
const {signup, login, deleteUser, updateUser, getAllUsers,addUser } = require('../controllers/userController');
const authMiddleware  = require('../middleware/auth');
const roleMiddleware =require('../middleware/role');
//const roleMiddleware = require('./middleware/roleMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteUser);
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'Editor']), updateUser);
router.get('/', authMiddleware, roleMiddleware(['Admin']), getAllUsers);
router.post('/add-user', authMiddleware, roleMiddleware(['admin']), addUser);
// Protect routes  addUser
router.post('/admin-route', roleMiddleware(['Admin']), (req, res) => {
    // Only accessible by users with the 'Admin' role
    res.status(200).send('Admin Route');
  });
module.exports = router;

router.get('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});
// function invalidateToken(token) {
//   console.log(`Invalidating token: ${token}`);
//   // Implement logic to invalidate the token (e.g., blacklist it)
// }


// // routes/userRoutes.js
// const express = require('express');
// const { User } = require('../models');
// const { isAdmin } = require('../middleware/roleMiddleware');
// const router = express.Router();

// // Create a new user (Admins can create new users)
// router.post('/', isAdmin, async (req, res) => {
//   try {
//     const { username, password, role } = req.body;
//     const newUser = await User.create({ username, password, role: role || 'user' });
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating user', error: error.message });
//   }
// });

// // Update user role (Admins can change roles, but not other admins)
// router.put('/:id', isAdmin, async (req, res) => {
//   const { id } = req.params;
//   const { role } = req.body;

//   try {
//     const user = await User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Prevent admins from changing other admins' roles
//     if (user.role === 'admin' && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Cannot change role of another admin' });
//     }

//     user.role = role;
//     await user.save();
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating user', error: error.message });
//   }
// });

// // Delete a user (Admins only)
// router.delete('/:id', isAdmin, async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     const user = await User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Prevent deleting an admin
//     if (user.role === 'admin') {
//       return res.status(403).json({ message: 'Cannot delete an admin' });
//     }

//     await user.destroy();
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting user', error: error.message });
//   }
// });

// module.exports = router;
