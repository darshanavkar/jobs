// videoController.js
import Video from '../models/Video.js';

// Middleware for video upload
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, filename, path, user } = req.body;

    // Create a new Video document in the MongoDB collection
    const video = new Video({ title, description, filename, path, user });

    // Save the video document to the database
    await video.save();

    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Video upload failed' });
  }
};

// Middleware for downloading videos
export const downloadVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Implement logic to send the video file to the client
    // For example, using the 'fs' module or streaming the file

    res.status(200).json({ message: 'Video downloaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Video download failed' });
  }
};
