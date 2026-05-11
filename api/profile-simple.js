export default function handler(req, res) {
  res.status(200).json({ 
    success: true, 
    data: { 
      name: 'Samuel AKINGENEYE',
      title: 'Software Engineer',
      location: 'Kigali, Rwanda'
    } 
  });
}
