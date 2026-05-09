import mongoose from 'mongoose';

const uri = "mongodb+srv://portfolio_admin:admin123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  console.log('✅ SUCCESS! Connected to MongoDB');
  await mongoose.disconnect();
} catch (err) {
  console.error('❌ Failed:', err.message);
}
