import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  console.log('✅ Connected');
  
  const userSchema = new mongoose.Schema({ email: String, password: String });
  const User = mongoose.model('User', userSchema);
  
  // Hash the password correctly
  const hash = await bcrypt.hash('admin123', 10);
  
  // Update the user
  const result = await User.updateOne(
    { email: 'freshtalent491@gmail.com' },
    { $set: { password: hash } }
  );
  
  console.log('✅ Password updated!');
  
  // Verify it works
  const user = await User.findOne({ email: 'freshtalent491@gmail.com' });
  const testMatch = await bcrypt.compare('admin123', user.password);
  console.log('Password verification:', testMatch ? '✅ WORKS' : '❌ FAILS');
  
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
}
