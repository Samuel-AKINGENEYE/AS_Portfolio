import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
  
  const userSchema = new mongoose.Schema({ email: String, password: String });
  const User = mongoose.model('User', userSchema);
  
  const user = await User.findOne({ email: 'freshtalent491@gmail.com' });
  
  if (user) {
    console.log('✅ Admin user FOUND!');
    console.log('Email:', user.email);
    console.log('Password hash length:', user.password.length);
  } else {
    console.log('❌ Admin user NOT found!');
  }
  
  await mongoose.disconnect();
} catch (err) {
  console.error('❌ Error:', err.message);
}
