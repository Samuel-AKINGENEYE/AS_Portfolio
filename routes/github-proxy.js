import express from 'express';

const router = express.Router();

// Proxy endpoint for GitHub API (bypasses CORS)
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
    
    res.json({ 
      success: true, 
      data: {
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        avatar_url: data.avatar_url,
        name: data.name,
        bio: data.bio
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get contributions (events)
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
