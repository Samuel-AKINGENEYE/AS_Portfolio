import jwt from 'jsonwebtoken';

export function verifyAdmin(req) {
  const auth = req.headers.authorization ?? '';
  if (!auth.startsWith('Bearer ')) throw new Error('Unauthorized');
  return jwt.verify(auth.slice(7), process.env.JWT_SECRET);
}

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    res.status(200).end();
    return true;
  }
  return false;
}
