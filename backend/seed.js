import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Certificate from './models/Certificate.js';
import Profile from './models/Profile.js';
import Skill from './models/Skill.js';
import Education from './models/Education.js';
import Experience from './models/Experience.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('✅ Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Certificate.deleteMany({}),
      Profile.deleteMany({}),
      Skill.deleteMany({}),
      Education.deleteMany({}),
      Experience.deleteMany({}),
    ]);
    console.log('🗑️ Cleared existing data');

    // Admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    await User.create({ email: adminEmail, password: adminPassword });
    console.log(`👤 Admin user created: ${adminEmail}`);

    // Projects
    await Project.insertMany([
      {
        title: 'SpeakSmart – AI Language Tutor',
        description: 'Voice-based AI tutor with real-time feedback helping users improve English speaking skills.',
        longDescription: 'An AI-powered language learning platform built to solve limited English practice opportunities in Rwanda.',
        techStack: ['React', 'Node.js', 'OpenAI API', 'Web Speech API', 'Express', 'MongoDB'],
        liveUrl: 'https://speak-smart-pi.vercel.app/',
        githubUrl: 'https://github.com/samuel-akingeneye/speaksmart',
        featured: true,
      },
      {
        title: 'Civic Connect Rwanda',
        description: 'Civic engagement platform enabling citizens to report local issues and track service requests.',
        longDescription: 'A full-stack civic platform bridging citizens and local government.',
        techStack: ['Next.js', 'PostgreSQL', 'Mapbox', 'Twilio SMS', 'Node.js'],
        liveUrl: 'https://samuel-akingeneye.github.io/Smart-Citizen-Service-Request-System/',
        githubUrl: 'https://github.com/samuel-akingeneye/civic-connect-rwanda',
        featured: true,
      },
      {
        title: 'Portfolio Dashboard',
        description: 'Full-stack portfolio site with custom admin CMS.',
        techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'JWT', 'Express'],
        liveUrl: 'https://as-portfolio-livid-one.vercel.app',
        githubUrl: 'https://github.com/samuel-akingeneye/portfolio',
        featured: true,
      },
    ]);
    console.log('📁 Projects seeded (3)');

    // Skills
    await Skill.insertMany([
      { name: 'React', category: 'Frontend', proficiency: 90, order: 1 },
      { name: 'Next.js', category: 'Frontend', proficiency: 85, order: 2 },
      { name: 'TypeScript', category: 'Frontend', proficiency: 85, order: 3 },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 90, order: 4 },
      { name: 'Node.js', category: 'Backend', proficiency: 88, order: 1 },
      { name: 'Express', category: 'Backend', proficiency: 88, order: 2 },
      { name: 'Python', category: 'Backend', proficiency: 80, order: 3 },
      { name: 'PostgreSQL', category: 'Database', proficiency: 85, order: 1 },
      { name: 'MongoDB', category: 'Database', proficiency: 88, order: 2 },
      { name: 'Redis', category: 'Database', proficiency: 75, order: 3 },
      { name: 'Git', category: 'Tools', proficiency: 90, order: 1 },
      { name: 'Docker', category: 'Tools', proficiency: 80, order: 2 },
      { name: 'AWS', category: 'Tools', proficiency: 75, order: 3 },
    ]);
    console.log('💪 Skills seeded (13)');

    // Education
    await Education.insertMany([
      {
        institution: 'freeCodeCamp',
        degree: 'Full Stack Web Development Bootcamp',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        description: 'Completed comprehensive full-stack bootcamp covering modern web technologies.',
        order: 1,
      },
      {
        institution: 'Self-Taught Learning',
        degree: 'Continuous Learning',
        current: true,
        description: 'Actively learning through online courses, documentation, and building real projects.',
        order: 2,
      },
    ]);
    console.log('🎓 Education seeded (2)');

    // Experience
    await Experience.insertMany([
      {
        company: 'Independent Software Engineer',
        position: 'Full Stack Developer',
        location: 'Rwanda',
        startDate: new Date('2023-01-01'),
        current: true,
        description: 'Building real-world applications solving local problems.',
        achievements: ['Built AI-powered language tutor with 300+ users', 'Created civic engagement platform reducing response time by 40%', 'Developed full-stack portfolio with custom CMS'],
        order: 1,
      },
    ]);
    console.log('💼 Experience seeded (1)');

    // Certificates
    await Certificate.insertMany([
      { name: 'Artificial Intelligence Fundamentals', issuer: 'IBM', category: 'AI/ML' },
      { name: 'JavaScript Algorithms & Data Structures', issuer: 'freeCodeCamp', category: 'Web Dev' },
      { name: 'Responsive Web Design', issuer: 'freeCodeCamp', category: 'Web Dev' },
      { name: 'Introduction to Cybersecurity', issuer: 'Cisco', category: 'Cybersecurity' },
      { name: '182 Pathway Certificate', issuer: 'ALX Africa', category: 'Web Dev' },
    ]);
    console.log('🏆 Certificates seeded (5)');

    // Profile
    await Profile.create({
      name: 'Samuel AKINGENEYE',
      title: 'Software Engineer',
      bio: "I'm a self-taught software engineer from Rwanda who turned curiosity into code. After completing freeCodeCamp's full-stack bootcamp, I built real solutions: an AI-powered language tutor that helped 300+ learners practice conversational English, and a civic engagement platform that reduced local service request time by 40%.",
      location: 'Kigali, Rwanda',
      email: 'samuel@example.com',
      availability: 'Available Now',
      yearsOfExperience: 2,
      socialLinks: {
        github: 'https://github.com/samuel-akingeneye',
        linkedin: 'https://linkedin.com/in/samuel-akingeneye',
        twitter: 'https://twitter.com/samuel_ak',
      },
    });
    console.log('👤 Profile seeded');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Admin email   : ${adminEmail}`);
    console.log(`Admin password: ${adminPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
