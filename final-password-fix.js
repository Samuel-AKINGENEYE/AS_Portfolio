import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

// Generate fresh hash for "admin123"
const freshHash = await bcrypt.hash('admin123', 10);
console.log('Generated hash:', freshHash);

try {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
  
  const userSchema = new mongoose.Schema({ email: String, password: String });
  const User = mongoose.model('User', userSchema);
  
  // Update password
  const result = await User.updateOne(
    { email: 'freshtalent491@gmail.com' },
    { $set: { password: freshHash } }
  );
  
  console.log('✅ Password updated!');
  
  // Verify
  const user = await User.findOne({ email: 'freshtalent491@gmail.com' });
  const isValid = await bcrypt.compare('admin123', user.password);
  console.log('Password test:', isValid ? '✅ WORKS' : '❌ FAILS');
  
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
}
