import express from 'express';

const router = express.Router();

// Get GitHub user stats
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
    
    if (data.message === 'Not Found') {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: {
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        avatar_url: data.avatar_url,
        name: data.name,
        bio: data.bio,
        location: data.location
      }
    });
  } catch (error) {
    console.error('GitHub user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get GitHub events (contributions)
router.get('/events/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events?per_page=50`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      }
    });
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return res.json({ success: true, data: [] });
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('GitHub events error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
