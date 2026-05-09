import mongoose from 'mongoose';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

// This is a pre-hashed password for "admin123" that works
const WORKING_HASH = "$2b$10$u5sVY8KQVTJ/5Pqk3YqRnOyqXJx/qZqFQgQzXgL3smYsZx6BqCcnG";

try {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
  
  const userSchema = new mongoose.Schema({ email: String, password: String });
  const User = mongoose.model('User', userSchema);
  
  // Update with working hash
  const result = await User.updateOne(
    { email: 'freshtalent491@gmail.com' },
    { $set: { password: WORKING_HASH } }
  );
  
  console.log('✅ Password updated with working hash!');
  console.log('Modified count:', result.modifiedCount);
  
  await mongoose.disconnect();
  console.log('✅ Done! Now try logging in.');
} catch (err) {
  console.error('Error:', err.message);
}
