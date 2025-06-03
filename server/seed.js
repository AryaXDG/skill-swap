import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Skill from './models/Skill.js';
import User from './models/User.js';
import connectDB from './config/db.js';
import 'dotenv/config';

// --- Re-usable Data ---

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const skillCategories = {
  "Technology & Programming": [
    'JavaScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go',
    'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django',
    'Flask', 'Spring', 'Ruby on Rails', 'Next.js', 'Gatsby', 'Svelte', 'Astro',
    'HTML5', 'CSS3', 'Sass', 'LESS', 'Tailwind CSS', 'Bootstrap', 'jQuery',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'SQLite', 'Oracle',
    'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
    'Terraform', 'Ansible', 'Jenkins', 'CircleCI', 'Agile', 'Scrum', 'Jira',
    'Linux', 'Bash Scripting', 'PowerShell', 'REST APIs', 'GraphQL', 'WebSockets',
    'Data Structures', 'Algorithms', 'Network Security', 'Cybersecurity', 'Penetration Testing',
    'Data Analysis', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'R',
    'Data Visualization', 'D3.js', 'Tableau', 'Power BI', 'Excel', 'Google Sheets',
    'Mobile Development', 'React Native', 'Flutter', 'Android Development', 'iOS Development',
    'Unity', 'Unreal Engine', 'Game Development', 'WordPress', 'Shopify', 'Webflow'
  ],
  "Creative & Design": [
    'UI/UX Design', 'Graphic Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign',
    'Figma', 'Adobe XD', 'Sketch', 'User Research', 'Wireframing', 'Prototyping',
    'Video Editing', 'Adobe Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects',
    'Motion Graphics', 'Animation', '3D Modeling', 'Blender', 'Maya', 'AutoCAD',
    'Photography', 'Lightroom', 'Digital Photography', 'Portrait Photography',
    'Music Production', 'Ableton Live', 'Logic Pro X', 'FL Studio', 'Audio Engineering',
    'Sound Design', 'Podcasting', 'Voice Acting',
    'Content Writing', 'Copywriting', 'Creative Writing', 'Blogging', 'SEO Writing',
    'Technical Writing', 'Editing', 'Proofreading', 'Storytelling', 'Illustration'
  ],
  "Business & Marketing": [
    'Digital Marketing', 'SEO', 'SEM', 'Content Marketing', 'Social Media Marketing',
    'Email Marketing', 'Marketing Strategy', 'Brand Management', 'PPC Advertising',
    'Google Analytics', 'Facebook Ads', 'Marketing Automation', 'HubSpot', 'Salesforce',
    'Sales', 'Business Development', 'Lead Generation', 'CRM', 'Negotiation',
    'Project Management', 'Product Management', 'Product Roadmap', 'Agile Methodologies',
    'Business Strategy', 'Business Analysis', 'Market Research', 'Financial Modeling',
    'E-commerce', 'Dropshipping', 'Amazon FBA', 'Recruiting', 'Human Resources (HR)'
  ],
  "Finance & Admin": [
    'Accounting', 'Bookkeeping', 'QuickBooks', 'Xero', 'Financial Analysis',
    'Financial Planning', 'Investment Management', 'Risk Management', 'Auditing',
    'Tax Preparation', 'Data Entry', 'Microsoft Office', 'Microsoft Word', 'Microsoft PowerPoint',
    'Virtual Assistant', 'Administrative Support', 'Customer Service', 'Customer Support',
    'Zendesk', 'Intercom', 'Operations Management', 'Supply Chain Management'
  ],
  "Languages & Communication": [
    'Public Speaking', 'Presentation Skills', 'Communication', 'Team Leadership',
    'Management', 'Coaching', 'Mentoring', 'Conflict Resolution', 'Grant Writing',
    'English', 'Spanish', 'French', 'German', 'Mandarin Chinese', 'Japanese',
    'Korean', 'Italian', 'Portuguese', 'Arabic', 'Russian', 'Hindi',
    'Translation', 'Interpretation', 'Sign Language', 'TESOL'
  ],
  "Manual, Practical & Lifestyle Skills": [
    'Cooking', 'Baking', 'Culinary Arts', 'Pastry', 'Mixology', 'Bartending',
    'Gardening', 'Landscaping', 'Farming', 'Permaculture',
    'Woodworking', 'Carpentry', 'Furniture Making', 'Welding', 'Metalworking',
    'Electrical Wiring', 'Plumbing', 'Home Repair', 'DIY Projects', 'Auto Repair',
    'Mechanics', 'Sewing', 'Knitting', 'Crochet', 'Fashion Design', 'Textile Art',
    'Jewelry Making', 'Pottery', 'Ceramics', 'Painting', 'Drawing', 'Calligraphy',
    'Event Planning', 'Wedding Planning', 'Travel Planning', 'Real Estate'
  ],
  "Health & Wellness": [
    'Personal Training', 'Fitness Coaching', 'Yoga Instruction', 'Pilates',
    'Nutrition', 'Dietetics', 'Meal Planning', 'Holistic Health', 'Wellness Coaching',
    'Massage Therapy', 'Acupuncture', 'Meditation', 'Mindfulness',
    'Psychology', 'Counseling', 'Life Coaching', 'First Aid', 'CPR'
  ]
};

// --- Helper Functions for User Generation ---

const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Jesse', 'Kai', 'Devin', 'Avery', 'Skyler', 'Quinn', 'Rowan', 'Charlie', 'Finley', 'Dakota', 'Emerson', 'Sage', 'Parker'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const sampleBios = [
  'Full-stack developer passionate about building beautiful and functional web applications. Looking to trade my coding skills for help with public speaking!',
  'Graphic designer with a love for bold colors and clean lines. I can help you with branding or UI/UX, and I\'d love to learn Python for data analysis.',
  'Digital marketer specializing in SEO and content strategy. Seeking a skilled photographer to help me build my personal brand.',
  'Chef by trade, baker by passion. I can teach you the secrets to the perfect sourdough or any French pastry. Looking to learn Spanish!',
  'Data scientist who loves turning numbers into stories. Eager to swap my R and Python skills for help with creative writing or illustration.',
  'Yoga instructor and wellness coach. I can help you with mindfulness and flexibility, and I\'m seeking a marketing expert to grow my small business.',
  'Mechanical engineer who loves tinkering with 3D printers and building robots. I can teach you AutoCAD or Blender in exchange for guitar lessons.',
  'Fluent in three languages (English, French, Japanese) and a professional translator. I\'m looking to learn woodworking this year.',
  'Project manager with a PMP certification. I can help you organize any project, big or small. I want to learn video editing for my travel blog.',
  'Musician and audio engineer. I can produce your podcast or master your new track. Seeking someone to help me build a website for my portfolio.'
];

const sampleAvatars = [
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100',
  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100',
  'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100',
  'https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1to00&w=100',
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100',
  'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100'
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to get a random subset of an array
const getRandomSubset = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// --- Seeder Functions ---

/**
 * @desc Seeds the 'skills' collection if it's empty.
 */
const seedSkills = async () => {
  try {
    const skillCount = await Skill.countDocuments();
    if (skillCount > 0) {
      console.log('Skills already seeded. Skipping.');
      return;
    }

    console.log('No skills found. Seeding skills...');
    const skillsData = [];
    for (const category in skillCategories) {
      skillCategories[category].forEach(name => {
        skillsData.push({ name, category });
      });
    }

    await Skill.insertMany(skillsData);
    console.log(`Successfully seeded ${skillsData.length} skills!`);

  } catch (error) {
    console.error('Error seeding skills:', error);
    throw error; // Throw error to stop the main seeder
  }
};

/**
 * @desc Seeds the 'users' collection if it's empty.
 */
const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Users already seeded. Skipping.');
      return;
    }

    console.log('No users found. Seeding 100 users...');

    // 1. Get all skill IDs from the DB
    const allSkills = await Skill.find().select('_id');
    if (allSkills.length === 0) {
      console.error('No skills found in database. Cannot seed users.');
      console.error('Please run the seeder once to seed skills, then run again if users failed.');
      return;
    }

    // 2. Hash a default password
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);
    console.log(`All users will have the default password: ${defaultPassword}`);

    // 3. Create 100 user objects
    const usersToCreate = [];
    for (let i = 0; i < 100; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
      const email = `${username}@example.com`;

      // Get random skills for this user
      const possessedSkillCount = Math.floor(Math.random() * 6) + 5; // 5-10 skills
      const seekingSkillCount = Math.floor(Math.random() * 6) + 5;   // 5-10 skills
      
      const possessedSkills = getRandomSubset(allSkills, possessedSkillCount).map(skill => ({
        skill: skill._id,
        proficiency: getRandomElement(PROFICIENCIES)
      }));
      
      const seekingSkills = getRandomSubset(allSkills, seekingSkillCount).map(skill => ({
        skill: skill._id
      }));

      usersToCreate.push({
        username,
        email,
        passwordHash: hashedPassword,
        bio: getRandomElement(sampleBios),
        avatarUrl: getRandomElement(sampleAvatars),
        skills_possessed: possessedSkills,
        skills_seeking: seekingSkills
      });
    }

    // 4. Insert all users at once
    await User.insertMany(usersToCreate);
    console.log(`Successfully seeded ${usersToCreate.length} users!`);

  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};


/**
 * @desc Main seeder function
 */
const seedDB = async () => {
  try {
    await connectDB();
    console.log('Database connected.');

    // Seed skills first (will skip if already present)
    await seedSkills();
    
    // Then seed users (will skip if already present)
    await seedUsers();

    console.log('Database seeding completed successfully.');

  } catch (error) {
    console.error('Fatal error during database seeding:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run the seeder
seedDB();

