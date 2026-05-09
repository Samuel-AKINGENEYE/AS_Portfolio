import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
  
  // Define User schema directly (bypassing model issues)
  const userSchema = new mongoose.Schema({
    email: String,
    password: String,
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Clear existing users
  await User.deleteMany({});
  console.log('🗑️ Cleared existing users');
  
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = await User.create({
    email: 'freshtalent491@gmail.com',
    password: hashedPassword,
  });
  
  console.log('✅ Admin user created!');
  console.log('📧 Email:', user.email);
  console.log('🔑 Password: admin123');
  
  // Verify
  const count = await User.countDocuments();
  console.log(`📊 Total users: ${count}`);
  
  await mongoose.disconnect();
  console.log('✅ Done!');
} catch (err) {
  console.error('❌ Error:', err.message);
}
