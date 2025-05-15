import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs'; // Not needed yet
import Skill from './models/Skill.js';
// import User from './models/User.js'; // Not needed yet
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

// --- Helper Functions for User Generation --- (Removed user-specific helpers)
// Removed: const firstNames, lastNames, sampleBios, sampleAvatars, getRandomElement, getRandomSubset

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
// Removed: const seedUsers = async () => { ... }


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
    // Removed: await seedUsers();

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