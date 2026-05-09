import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  console.log('✅ Connected');
  
  const userSchema = new mongoose.Schema({ email: String, password: String });
  const User = mongoose.model('User', userSchema);
  
  // Hash the password
  const hash = await bcrypt.hash('admin123', 10);
  
  // Update the user - add the password field back
  const result = await User.updateOne(
    { email: 'freshtalent491@gmail.com' },
    { $set: { password: hash } }
  );
  
  console.log('✅ Password added back and hashed!');
  console.log('Modified count:', result.modifiedCount);
  
  // Verify it works
  const user = await User.findOne({ email: 'freshtalent491@gmail.com' });
  console.log('User found:', user ? 'Yes' : 'No');
  console.log('Password hash:', user ? user.password : 'N/A');
  
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
}
