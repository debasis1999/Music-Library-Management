const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming token is sent as 'Bearer token'

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token using the secret key
    console.log('decoded', decoded);  // Log the decoded token info for debugging
    req.user = decoded; // Attach decoded info to request
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying token:', error);  // Log the error for debugging
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
