import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// GitHub GraphQL endpoint to get real contribution data
router.get('/contributions/:username', async (req, res) => {
  const { username } = req.params;
  const { year } = req.query;
  
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
    
    const fromDate = `${year}-01-01T00:00:00Z`;
    const toDate = `${year}-12-31T23:59:59Z`;
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username, from: fromDate, to: toDate }
      })
    });
    
    const data = await response.json();
    res.json({ success: true, data: data.data });
  } catch (error) {
    console.error('GitHub API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
