import express from 'express';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'GitHub API is working' });
});

// Contributions endpoint
router.get('/contributions/:username/:year', async (req, res) => {
  const { username, year } = req.params;
  const targetYear = parseInt(year) || new Date().getFullYear();
  
  console.log(`Fetching contributions for ${username}, year ${targetYear}`);
  console.log(`GitHub token present: ${!!process.env.GITHUB_TOKEN}`);
  
  // If no token, return mock data (but show need token)
  if (!process.env.GITHUB_TOKEN) {
    // Return mock data for visual display
    const weeks = [];
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31);
    let currentWeek = [];
    let currentDate = new Date(startDate);
    let total = 0;
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      let count = 0;
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count = Math.random() > 0.7 ? Math.floor(Math.random() * 8) + 1 : 0;
      } else {
        count = Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0;
      }
      total += count;
      currentWeek.push({ date: currentDate.toISOString().split('T')[0], count });
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);
    
    return res.json({ 
      success: true, 
      data: { weeks, total, year: targetYear },
      note: 'Using mock data. Add GITHUB_TOKEN for real data.'
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
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username, from: fromDate, to: toDate } })
    });
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0]?.message);
    }
    
    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;
    
    if (!calendar) {
      throw new Error('No calendar data');
    }
    
    const weeks = calendar.weeks.map(week => 
      week.contributionDays.map(day => ({ date: day.date, count: day.contributionCount }))
    );
    
    res.json({ success: true, data: { weeks, total: calendar.totalContributions, year: targetYear } });
  } catch (error) {
    console.error('Error:', error.message);
    res.json({ success: false, error: error.message });
  }
});

export default router;
 
