import mongoose from 'mongoose';

const uri = "mongodb+srv://portfolio_admin:mongodb123@cluster0.wkxyc0y.mongodb.net/portfolio?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri);
  console.log('✅ Connected');
  
  const profileSchema = new mongoose.Schema({ avatar: String, name: String });
  const Profile = mongoose.model('Profile', profileSchema);
  
  const profile = await Profile.findOne({});
  console.log('Profile avatar URL:', profile?.avatar || 'No avatar set');
  console.log('Profile name:', profile?.name);
  
  await mongoose.disconnect();
} catch (err) {
  console.error('Error:', err.message);
}
