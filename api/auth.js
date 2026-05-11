export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    if (email === 'freshtalent491@gmail.com' && password === 'admin123') {
      return res.status(200).json({ 
        success: true, 
        data: { token: 'test-token', user: { email } } 
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
