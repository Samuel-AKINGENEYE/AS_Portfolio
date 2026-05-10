import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

// Generate a fresh hash
const password = 'admin123';
const freshHash = await bcrypt.hash(password, 10);
console.log('Using hash:', freshHash);

try {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
  
  const userSchema = new mongoose.Schema({ email: String, password: String });
  const User = mongoose.model('User', userSchema);
  
  // Update with fresh hash
  const result = await User.updateOne(
    { email: 'freshtalent491@gmail.com' },
    { $set: { password: freshHash } }
  );
  
  console.log('✅ Password updated with fresh hash!');
  console.log('Modified count:', result.modifiedCount);
  
  // Verify it works
  const user = await User.findOne({ email: 'freshtalent491@gmail.com' });
  const testMatch = await bcrypt.compare('admin123', user.password);
  console.log('Verification:', testMatch ? '✅ SUCCESS' : '❌ FAILED');
  
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
}
