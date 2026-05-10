import express from 'express';

const router = express.Router();

// Fetch contribution data from GitHub's contribution graph
router.get('/:username/:year', async (req, res) => {
  const { username, year } = req.params;
  const targetYear = parseInt(year) || new Date().getFullYear();
  
  try {
    // Use the official GitHub contributions API via graphql
    // This is a public endpoint that returns the contribution data
    const response = await fetch(
      `https://github-contributions-api.jogruber.vercel.app/${username}?y=${targetYear}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Portfolio-App'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.contributions) {
      // Format the data for our calendar
      const weeks = [];
      let currentWeek = [];
      let total = 0;
      
      // Sort contributions by date
      const sorted = [...data.contributions].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      // Group into weeks (Sunday to Saturday)
      for (const day of sorted) {
        const date = new Date(day.date);
        const dayOfWeek = date.getDay(); // 0 = Sunday
        
        currentWeek.push({
          date: day.date,
          count: day.count || 0
        });
        total += day.count || 0;
        
        if (dayOfWeek === 6) { // Saturday, week complete
          weeks.push([...currentWeek]);
          currentWeek = [];
        }
      }
      
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      
      res.json({
        success: true,
        data: {
          weeks,
          total,
          year: targetYear
        }
      });
    } else {
      // Return empty but valid data structure
      res.json({
        success: true,
        data: {
          weeks: [],
          total: 0,
          year: targetYear
        }
      });
    }
  } catch (error) {
    console.error('Contributions error:', error);
    // Return empty data structure instead of error
    res.json({
      success: true,
      data: {
        weeks: [],
        total: 0,
        year: targetYear
      }
    });
  }
});

export default router;
