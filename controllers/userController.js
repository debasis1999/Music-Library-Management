const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Signup controller function
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  // Check if both fields are provided
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request, Reason: Missing Field',
      error: null
    });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        data: null,
        message: 'Email already exists.',
        error: null
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine if the new user should be an admin (first user)
    const userCount = await User.count(); // Get the total number of users
    const isAdmin = userCount === 0; // Assign admin to the first user

    // Create a new user with the determined role
    const newUser = new User({
      email,
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'user'  // Set first user as admin, others as regular users
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token for the new user
    const token = jwt.sign(
      { id: newUser.user_id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET, // Ensure this is defined in your .env file
      { expiresIn: '1h' } // Token expiration time
      
    );console.log('Generated Token:', token);

    // Respond with the success message and token
    return res.status(201).json({
      newUser:{
        user_id: newUser.user_id,
        email: newUser.email,
        role: newUser.role,
    },
      status: 201,
      data: {
        token: token,  // Send the token back in the response
      },
      message: 'User created successfully.',
      error: null
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};


// const signup = async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     // Validate input
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({ username, email, password: hashedPassword });

//     // Generate token
//     const token = jwt.sign(
//       { userId: user.user_id, role: user.role }, // user_id is the primary key in your model
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     // Respond with success
//     res.status(201).json({
//       message: 'User created successfully',
//       user: {
//         user_id: user.user_id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error('Error during signup:', error);

//     // Handle unique constraint errors
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(400).json({ error: 'Email or username already in use' });
//     }

//     res.status(500).json({ error: 'Error creating user' });
//   }
// };


exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request, Reason: Missing Field',
      error: null,
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'User not found.',
        error: null,
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Invalid credentials.',
        error: null,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email , role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );console.log('Generated Token:', token);

    return res.status(200).json({
      status: 200,
      data: { token },
      message: 'Login successful.',
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.addUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log(decoded,'add-user decoded');  // Log decoded token to inspect its contents
    // Check if the requesting user is an admin
    const requestingUser = await User.findByPk(decoded.id);
    console.log('Requesting User:', requestingUser);

    if (!requestingUser || requestingUser.role !== 'admin') {
      console.log('User not found in database for ID:', decoded.id);
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    // Extract new user details from the request body
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request: Missing required fields.',
        error: null,
      });
    }

    // Check if the role is valid
    if (role === 'admin') {
      console.log('User is not an admin:', requestingUser);
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed: Cannot create an admin user.',
        error: null,
      });
    }

    if (role !== 'editor' && role !== 'viewer') {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request: Invalid role provided.',
        error: null,
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        data: null,
        message: 'Email already exists.',
        error: null,
      });
    }

    // Create the new user
    await User.create({ email, password, role });

    return res.status(201).json({
      status: 201,
      data: null,
      message: 'User created successfully.',
      error: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request',
      error: error.message,
    });
  }
};


// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');

    // Check if the requesting user is an admin
    const requestingUser = await User.findByPk(decoded.id);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    // Parse query parameters for pagination and filtering
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = parseInt(req.query.offset, 10) || 0;
    const role = req.query.role || null;

    const whereCondition = role ? { role } : {};

    // Retrieve users with pagination and filtering
    const users = await User.findAll({
      where: whereCondition,
      attributes: ['id', 'email', 'role', 'createdAt'],
      limit,
      offset,
    });

    return res.status(200).json({
      status: 200,
      data: users,
      message: 'Users retrieved successfully.',
      error: null,
      
    });
    console.log(decoded);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request',
      error: error.message,
    });
  }
};
// module.exports = { signup, login };

//const SECRET_KEY = process.env.JWT_SECRET; // Replace with your actual secret key

// Dummy function to invalidate token (could be storing it in a blacklist, etc.)
// function invalidateToken(token) {
//   console.log(`Invalidating token: ${token}`);
//   // Add the logic to invalidate the token (e.g., store it in a blacklist)
// }

// Logout controller function
exports.logout = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract token from header

  if (!token) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request: Token is required.',
      error: null
    });
  }

  try {
    // Verify the token using JWT
    jwt.verify(token, SECRET_KEY);

    // If token is valid, invalidate it (for example, by blacklisting)
    invalidateToken(token);

    return res.status(200).json({
      status: 200,
      data: null,
      message: 'User logged out successfully.',
      error: null
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request: Invalid token.',
      error: null
    });
  }
};
