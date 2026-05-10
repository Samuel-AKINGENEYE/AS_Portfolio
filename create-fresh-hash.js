import bcrypt from 'bcryptjs';

const password = 'admin123';
const hash = await bcrypt.hash(password, 10);
console.log('New hash for "admin123":');
console.log(hash);
