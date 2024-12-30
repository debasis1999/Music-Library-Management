// Error handling middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    console.error(err); // Optionally log the error to the console or a logging service
    res.status(statusCode).json({ error: message });
  };
  
  module.exports = errorHandler;
  