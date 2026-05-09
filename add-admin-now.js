import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
  
  const userSchema = new mongoose.Schema({
    email: String,
    password: String,
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = await User.create({
    email: 'freshtalent491@gmail.com',
    password: hashedPassword,
  });
  
  console.log('✅ Admin user created successfully!');
  console.log('📧 Email:', user.email);
  console.log('🔑 Password: admin123');
  
  // Verify it was created
  const count = await User.countDocuments();
  console.log(`📊 Total users now: ${count}`);
  
  await mongoose.disconnect();
} catch (err) {
  console.error('❌ Error:', err.message);
}
