import mongoose from 'mongoose';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
  
  const userSchema = new mongoose.Schema({ email: String, password: String });
  const User = mongoose.model('User', userSchema);
  
  const users = await User.find({});
  console.log(`📊 Total users in database: ${users.length}`);
  
  users.forEach(user => {
    console.log(`- ${user.email}`);
  });
  
  await mongoose.disconnect();
} catch (err) {
  console.error('❌ Error:', err.message);
}
