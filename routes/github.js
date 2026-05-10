import express from 'express';

const router = express.Router();

// Simple endpoint to proxy GitHub API requests to avoid CORS
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      }
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user events (contributions)
router.get('/events/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      }
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
