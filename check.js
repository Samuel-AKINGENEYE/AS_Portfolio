import mongoose from 'mongoose';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  const userSchema = new mongoose.Schema({ email: String });
  const User = mongoose.model('User', userSchema);
  const users = await User.find({});
  console.log(`📊 Total users: ${users.length}`);
  users.forEach(u => console.log(' -', u.email));
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
}
