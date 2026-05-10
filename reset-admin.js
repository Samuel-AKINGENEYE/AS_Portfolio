import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
  
  const userSchema = new mongoose.Schema({ email: String, password: String });
  const User = mongoose.model('User', userSchema);
  
  // Delete all existing users
  await User.deleteMany({});
  console.log('🗑️ Deleted all users');
  
  // Create new admin with fresh hash
  const plainPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  const newUser = await User.create({
    email: 'freshtalent491@gmail.com',
    password: hashedPassword
  });
  
  console.log('✅ Admin user created!');
  console.log('Email:', newUser.email);
  console.log('Password used:', plainPassword);
  
  // Immediate verification
  const storedUser = await User.findOne({ email: 'freshtalent491@gmail.com' });
  const isMatch = await bcrypt.compare('admin123', storedUser.password);
  console.log('Login test:', isMatch ? '✅ SUCCESS - Password works!' : '❌ FAILED - Password mismatch');
  
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
}
