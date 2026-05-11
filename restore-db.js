/**
 * restore-db.js — Restores MongoDB Atlas with the full portfolio dataset.
 * Uses the native MongoDB driver (bypasses Mongoose buffering issues).
 * Run: node restore-db.js
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const restore = async () => {
  console.log('🔌 Connecting to MongoDB Atlas...');
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
  await client.connect();
  const db = client.db('portfolio');
  console.log('✅ Connected\n');

  // ── Clear all collections ──────────────────────────────────────────────────
  const cols = ['users', 'projects', 'certificates', 'profiles', 'skills', 'educations', 'experiences'];
  for (const col of cols) await db.collection(col).deleteMany({});
  console.log('🗑️  Cleared existing data\n');

  // ── Admin user (bcrypt-hash the password as Mongoose's pre-save hook would) ─
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await db.collection('users').insertOne({
    email: 'freshtalent491@gmail.com',
    password: hashedPassword,
    createdAt: new Date(),
  });
  console.log('👤 Admin user created');
  console.log('   Email   : freshtalent491@gmail.com');
  console.log('   Password: admin123\n');

  // ── Profile ────────────────────────────────────────────────────────────────
  await db.collection('profiles').insertOne({
    name: 'Samuel AKINGENEYE',
    title: 'Software Engineer',
    bio: "I'm a self-taught software engineer from Rwanda who turned curiosity into code. After completing freeCodeCamp's full-stack bootcamp, I built real solutions: an AI-powered language tutor that helped 300+ learners practice conversational English, and a civic engagement platform that reduced local service request time by 40%.",
    location: 'Kigali, Rwanda',
    email: 'freshtalent491@gmail.com',
    availability: 'Available Now',
    yearsOfExperience: 2,
    avatar: 'https://res.cloudinary.com/dtswzyqks/image/upload/v1778364437/portfolio/avatars/jwmnu7ukubjeypowrm8g.png',
    resumeUrl: 'https://res.cloudinary.com/dtswzyqks/image/upload/v1778423492/portfolio/resumes/tpazc3kptlvhoym6nm7z.pdf',
    socialLinks: {
      github: 'https://github.com/Samuel-AKINGENEYE',
      linkedin: 'https://linkedin.com/in/samuel-akingeneye',
      twitter: 'https://x.com/TalentFres47507',
    },
    updatedAt: new Date(),
  });
  console.log('👤 Profile restored');

  // ── Projects ───────────────────────────────────────────────────────────────
  const now = new Date();
  await db.collection('projects').insertMany([
    {
      title: 'SpeakSmart – AI Language Tutor',
      description: 'Voice-based AI tutor with real-time feedback helping users improve English speaking skills.',
      longDescription: 'An AI-powered language learning platform built to solve limited English practice opportunities in Rwanda. Used by 300+ learners.',
      techStack: ['React', 'Node.js', 'OpenAI API', 'Web Speech API', 'Express', 'MongoDB'],
      liveUrl: 'https://speak-smart-pi.vercel.app/',
      githubUrl: 'https://github.com/samuel-akingeneye/speaksmart',
      imageUrl: '',
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'Civic Connect Rwanda',
      description: 'Civic engagement platform enabling citizens to report local issues and track service requests.',
      longDescription: 'A full-stack civic platform bridging citizens and local government, reducing service request response time by 40%.',
      techStack: ['Next.js', 'PostgreSQL', 'Mapbox', 'Twilio SMS', 'Node.js'],
      liveUrl: 'https://samuel-akingeneye.github.io/Smart-Citizen-Service-Request-System/',
      githubUrl: 'https://github.com/samuel-akingeneye/civic-connect-rwanda',
      imageUrl: '',
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'Portfolio Dashboard',
      description: 'Full-stack portfolio site with custom admin CMS for managing all content.',
      longDescription: 'A self-built portfolio and admin dashboard using React, Node.js, MongoDB, and JWT authentication.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'JWT', 'Express'],
      liveUrl: 'https://samuelak.netlify.app',
      githubUrl: 'https://github.com/samuel-akingeneye/portfolio',
      imageUrl: '',
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
  ]);
  console.log('📁 Projects restored (3)');

  // ── Skills ─────────────────────────────────────────────────────────────────
  await db.collection('skills').insertMany([
    { name: 'React',        category: 'Frontend',  proficiency: 90, order: 1, createdAt: now, updatedAt: now },
    { name: 'Next.js',      category: 'Frontend',  proficiency: 85, order: 2, createdAt: now, updatedAt: now },
    { name: 'TypeScript',   category: 'Frontend',  proficiency: 85, order: 3, createdAt: now, updatedAt: now },
    { name: 'Tailwind CSS', category: 'Frontend',  proficiency: 90, order: 4, createdAt: now, updatedAt: now },
    { name: 'Node.js',      category: 'Backend',   proficiency: 88, order: 1, createdAt: now, updatedAt: now },
    { name: 'Express',      category: 'Backend',   proficiency: 88, order: 2, createdAt: now, updatedAt: now },
    { name: 'Python',       category: 'Backend',   proficiency: 80, order: 3, createdAt: now, updatedAt: now },
    { name: 'Golang (Go)',  category: 'Backend',   proficiency: 70, order: 4, createdAt: now, updatedAt: now },
    { name: 'PostgreSQL',   category: 'Database',  proficiency: 85, order: 1, createdAt: now, updatedAt: now },
    { name: 'MongoDB',      category: 'Database',  proficiency: 88, order: 2, createdAt: now, updatedAt: now },
    { name: 'Redis',        category: 'Database',  proficiency: 75, order: 3, createdAt: now, updatedAt: now },
    { name: 'Supabase',     category: 'Database',  proficiency: 75, order: 4, createdAt: now, updatedAt: now },
    { name: 'Git',          category: 'Tools',     proficiency: 90, order: 1, createdAt: now, updatedAt: now },
    { name: 'Docker',       category: 'Tools',     proficiency: 80, order: 2, createdAt: now, updatedAt: now },
    { name: 'AWS',          category: 'Tools',     proficiency: 75, order: 3, createdAt: now, updatedAt: now },
    { name: 'VS Code',      category: 'Tools',     proficiency: 95, order: 4, createdAt: now, updatedAt: now },
  ]);
  console.log('💪 Skills restored (16)');

  // ── Education ──────────────────────────────────────────────────────────────
  await db.collection('educations').insertMany([
    {
      institution: 'freeCodeCamp',
      degree: 'Full Stack Web Development Bootcamp',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      current: false,
      description: 'Completed comprehensive full-stack bootcamp covering React, Node.js, MongoDB, Express, and more.',
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      institution: 'ALX Africa',
      degree: '182 Pathway — Software Engineering',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-06-01'),
      current: false,
      description: 'Intensive software engineering program covering algorithms, systems programming, and professional development.',
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      institution: 'Self-Directed Learning',
      degree: 'Continuous Learning',
      current: true,
      description: 'Actively learning through online courses, official documentation, and building real-world projects.',
      order: 3,
      createdAt: now,
      updatedAt: now,
    },
  ]);
  console.log('🎓 Education restored (3)');

  // ── Experience ─────────────────────────────────────────────────────────────
  await db.collection('experiences').insertOne({
    company: 'Independent Software Engineer',
    position: 'Full Stack Developer',
    location: 'Kigali, Rwanda',
    startDate: new Date('2023-01-01'),
    current: true,
    description: 'Building real-world applications that solve local problems across East Africa.',
    achievements: [
      'Built AI-powered language tutor used by 300+ learners',
      'Created civic engagement platform reducing service response time by 40%',
      'Developed full-stack portfolio with custom CMS',
    ],
    order: 1,
    createdAt: now,
    updatedAt: now,
  });
  console.log('💼 Experience restored (1)');

  // ── Certificates ───────────────────────────────────────────────────────────
  await db.collection('certificates').insertMany([
    { name: 'Artificial Intelligence Fundamentals',    issuer: 'IBM',          category: 'AI/ML',         credentialUrl: '', imageUrl: '', createdAt: now, updatedAt: now },
    { name: 'JavaScript Algorithms & Data Structures', issuer: 'freeCodeCamp', category: 'Web Dev',       credentialUrl: '', imageUrl: '', createdAt: now, updatedAt: now },
    { name: 'Responsive Web Design',                   issuer: 'freeCodeCamp', category: 'Web Dev',       credentialUrl: '', imageUrl: '', createdAt: now, updatedAt: now },
    { name: 'Introduction to Cybersecurity',           issuer: 'Cisco',        category: 'Cybersecurity', credentialUrl: '', imageUrl: '', createdAt: now, updatedAt: now },
    { name: '182 Pathway Certificate',                 issuer: 'ALX Africa',   category: 'Web Dev',       credentialUrl: '', imageUrl: '', createdAt: now, updatedAt: now },
  ]);
  console.log('🏆 Certificates restored (5)');

  await client.close();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Database restored successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin → freshtalent491@gmail.com / admin123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

restore().catch((err) => {
  console.error('❌ Restore failed:', err.message);
  process.exit(1);
});
