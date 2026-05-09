import mongoose from 'mongoose';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  const userSchema = new mongoose.Schema({ email: String, password: String });
  const User = mongoose.model('User', userSchema);
  const user = await User.findOne({ email: 'freshtalent491@gmail.com' });
  console.log('User found:', user ? 'YES' : 'NO');
  if (user) console.log('Email:', user.email);
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
}
