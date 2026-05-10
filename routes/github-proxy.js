import express from 'express';

const router = express.Router();

router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App/1.0',
        'Authorization': process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : ''
      }
    });
    
    const data = await response.json();
    
    // Check if we got valid data
    if (data.message === 'Not Found') {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Return the actual data from GitHub
    res.json({ 
      success: true, 
      data: {
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        avatar_url: data.avatar_url,
        name: data.name || username,
        bio: data.bio,
        location: data.location,
        html_url: data.html_url
      }
    });
  } catch (error) {
    console.error('GitHub user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
