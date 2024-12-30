const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/dbConfig');
const errorHandler = require('./middleware/errorHandler'); // Import error handler
const app = express();

// sequelize.sync({ force: true })
//   .then(() => console.log('Database synced'))
//   .catch((error) => console.error('Error syncing database:', error));

// Load environment variables
dotenv.config(); 

// Middleware to parse JSON request bodies
app.use(express.json());  // Use express built-in middleware for JSON body parsing

// Log the database URL for debugging (ensure it’s loaded correctly)
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Enable CORS for all domains (adjust as needed)
app.use(cors());

// Global error handler middleware (place after other middlewares)
app.use(errorHandler);

// Database authentication and syncing
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Routes
const userRoutes = require('./routes/userRoutes');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const trackRoutes = require('./routes/trackRoutes');
const favoritesRoutes = require('./routes/favoriteRoutes');

// Use route handlers for various endpoints
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/artists', artistRoutes);
app.use('/api/v1/albums', albumRoutes);
app.use('/api/v1/tracks', trackRoutes);
app.use('/api/v1/favorites', favoritesRoutes);

// Default route to confirm server is working
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the music library API!' });
});

// Synchronize the database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch(err => {
    console.error('Database sync failed:', err);
});

// Global error handler (this will catch any unhandled errors from the above code)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
