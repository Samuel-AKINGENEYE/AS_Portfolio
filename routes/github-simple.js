import express from 'express';

const router = express.Router();

// Fetch REAL contributions using GitHub's GraphQL API
router.get('/:username/:year', async (req, res) => {
  const { username, year } = req.params;
  const targetYear = parseInt(year) || new Date().getFullYear();
  
  // If you have a GitHub token, it will fetch REAL data
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  if (!GITHUB_TOKEN) {
    // Return message that token is needed for real data
    return res.json({ 
      success: true, 
      data: { weeks: [], total: 0, year: targetYear, message: 'Add GITHUB_TOKEN to see real contributions' },
      needToken: true
    });
  }
  
  try {
    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
        }
      }
    `;
    
    const fromDate = `${targetYear}-01-01T00:00:00Z`;
    const toDate = `${targetYear}-12-31T23:59:59Z`;
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username, from: fromDate, to: toDate }
      })
    });
    
    const data = await response.json();
    
    if (data.data?.user?.contributionsCollection?.contributionCalendar) {
      const calendar = data.data.user.contributionsCollection.contributionCalendar;
      const weeks = calendar.weeks.map(week => 
        week.contributionDays.map(day => ({
          date: day.date,
          count: day.contributionCount
        }))
      );
      
      return res.json({
        success: true,
        data: {
          weeks,
          total: calendar.totalContributions,
          year: targetYear,
          source: 'real'
        }
      });
    }
    
    throw new Error('No data returned');
  } catch (error) {
    console.error('GitHub API error:', error);
    res.json({ 
      success: true, 
      data: { weeks: [], total: 0, year: targetYear, error: error.message },
      needToken: true
    });
  }
});

export default router;
