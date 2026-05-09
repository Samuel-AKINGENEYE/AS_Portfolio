import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = "mongodb+srv://portfolio_admin:admin123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

// Simple schema - no middleware, no pre-save hooks
const SimpleUserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const SimpleUser = mongoose.model('User', SimpleUserSchema);

try {
  await mongoose.connect(uri);
  console.log('✅ Connected');
  
  // Clear all
  await SimpleUser.deleteMany({});
  console.log('🗑️ Cleared');
  
  // Hash password
  const hash = await bcrypt.hash('admin123', 10);
  
  // Create user directly
  await SimpleUser.create({
    email: 'freshtalent491@gmail.com',
    password: hash
  });
  
  console.log('✅ Admin created: freshtalent491@gmail.com / admin123');
  
  // Verify
  const users = await SimpleUser.find({});
  console.log(`📊 Total users: ${users.length}`);
  
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('❌', err.message);
  process.exit(1);
}
