const sequelize = require('../config/dbConfig');
const express = require('express');
const Track = require('../models/Track');  // Assuming the Track model is in the models folder
const router = express.Router();

// Create a new track
exports.createTrack = async (req, res) => {
  try {
    const { name, duration, hidden, album_id } = req.body;

    // Create a new track with the provided data
    const newTrack = await Track.create({
      name,
      duration,
      hidden: hidden || false,  // default to false if hidden is not provided
      album_id,  // Assuming tracks belong to an album
    });

    res.status(201).json(
      
      newTrack
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating track', error: error.message });
  }
};
console.log('Track Model:', Track);

// Get all tracks
exports.getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.findAll();  // You can add conditions if needed

    res.status(200).json({
      message: 'Tracks fetched successfully',
      data: tracks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tracks', error: error.message });
  }
};

// Get a track by its ID
exports.getTrackById = async (req, res) => {
  const { track_id } = req.params;

  try {
    const track = await Track.findByPk(track_id);

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    res.status(200).json({
      message: 'Track fetched successfully',
      data: track,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching track', error: error.message });
  }
};

// Update a track
exports.updateTrack = async (req, res) => {
  const { track_id } = req.params;
  const { name, duration, hidden, album_id } = req.body;

  try {
    const track = await Track.findByPk(track_id);

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Update the track's details
    track.name = name || track.name;
    track.duration = duration || track.duration;
    track.hidden = hidden !== undefined ? hidden : track.hidden;
    track.album_id = album_id || track.album_id;

    await track.save();  // Save the updated track

    res.status(200).json({
      message: 'Track updated successfully',
      data: track,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating track', error: error.message });
  }
};

// Delete a track
exports.deleteTrack = async (req, res) => {
  const { track_id } = req.params;

  try {
    const track = await Track.findByPk(track_id);

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    await track.destroy();  // Delete the track

    res.status(200).json({
      message: 'Track deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting track', error: error.message });
  }
};


