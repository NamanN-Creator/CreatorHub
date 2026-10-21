require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Proposal = require('./models/Proposal');
const Task = require('./models/Task');
const Invoice = require('./models/Invoice');

// All demo accounts share this password so you don't have to remember
// different ones while demoing.
const DEMO_PASSWORD = 'password123';

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/creatorhub');
  console.log('MongoDB connected — seeding...');

  // Wipe existing data so this script can be re-run safely
  await Promise.all([
    User.deleteMany({}),
    Campaign.deleteMany({}),
    Proposal.deleteMany({}),
    Task.deleteMany({}),
    Invoice.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ---------- USERS ----------
  const [sarah, dev, anaya, riya, aman, meera] = await User.create([
    { name: 'Sarah Malhotra', email: 'sarah@creator.com', password: hashedPassword, role: 'creator' },
    { name: 'Dev Malik', email: 'dev@creator.com', password: hashedPassword, role: 'creator' },
    { name: 'Anaya Rao', email: 'anaya@creator.com', password: hashedPassword, role: 'creator' },
    { name: 'Riya Kapoor', email: 'riya@brand.com', password: hashedPassword, role: 'brand', brandName: 'Nike' },
    { name: 'Aman Shah', email: 'aman@talent.com', password: hashedPassword, role: 'talent' },
    { name: 'Meera Iyer', email: 'meera@finance.com', password: hashedPassword, role: 'finance' },
  ]);

  // ---------- CAMPAIGNS (created by Riya, the brand) ----------
  const [summerStreetwear, techLaunch, wellnessKit] = await Campaign.create([
    {
      name: 'Summer Streetwear Campaign',
      brand: 'Nike',
      description: "Showcase Nike's new summer streetwear line for a young, style-forward audience.",
      targetAudience: '18-28, urban, style-forward',
      niche: 'Fashion',
      platform: 'Instagram',
      deliverables: '1 Reel, 2 Stories, 3 Photos',
      budget: '₹25,000 - ₹40,000',
      startDate: new Date('2026-09-20'),
      endDate: new Date('2026-10-05'),
      status: 'published',
      createdBy: riya._id,
    },
    {
      name: 'Tech Product Launch',
      brand: 'Nike Labs',
      description: 'Unbox and review the new wearable tech launch.',
      targetAudience: '20-35, tech enthusiasts',
      niche: 'Technology',
      platform: 'YouTube',
      deliverables: '1 YouTube Short, 1 unboxing video',
      budget: '₹30,000 - ₹50,000',
      startDate: new Date('2026-09-25'),
      endDate: new Date('2026-10-10'),
      status: 'published',
      createdBy: riya._id,
    },
    {
      name: 'Winter Wellness Kit',
      brand: 'Nike Wellness',
      description: 'Promote the winter wellness bundle through daily routine content.',
      targetAudience: '22-40, health & wellness',
      niche: 'Lifestyle',
      platform: 'Instagram',
      deliverables: '1 Reel',
      budget: '₹10,000 - ₹18,000',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-25'),
      status: 'completed',
      createdBy: riya._id,
    },
  ]);

  // ---------- PROPOSALS ----------
  const [proposalSarah, proposalDev] = await Proposal.create([
    {
      campaign: summerStreetwear._id,
      creator: sarah._id,
      rate: 35000,
      deliverables: '1 Reel, 2 Stories, 3 Photos',
      message: "Hi Nike team, I'd love to bring this campaign to life with an outdoor summer shoot.",
      status: 'accepted',
    },
    {
      campaign: techLaunch._id,
      creator: dev._id,
      rate: 28000,
      deliverables: '1 YouTube Short, 1 unboxing video',
      message: 'I cover tech launches weekly — happy to turn this around fast.',
      status: 'pending',
    },
    {
      campaign: summerStreetwear._id,
      creator: anaya._id,
      rate: 22000,
      deliverables: '1 Reel',
      message: 'Can we talk about adjusting the rate given the 3-photo requirement?',
      status: 'negotiating',
    },
    {
      campaign: wellnessKit._id,
      creator: anaya._id,
      rate: 12000,
      deliverables: '1 Reel',
      message: 'Loved working on wellness content before, would love to collaborate.',
      status: 'accepted',
    },
  ]);

  // ---------- TASKS (assigned by Aman, the talent manager) ----------
  await Task.create([
    {
      campaign: summerStreetwear._id,
      creator: sarah._id,
      assignedBy: aman._id,
      title: 'Submit Instagram Reel draft',
      description: 'Focus on product visibility per brand guidelines.',
      deadline: new Date('2026-09-24'),
      priority: 'High',
      status: 'In Progress',
    },
    {
      campaign: summerStreetwear._id,
      creator: sarah._id,
      assignedBy: aman._id,
      title: 'Upload Product Photos',
      description: '3 product photos in natural outdoor lighting.',
      deadline: new Date('2026-09-20'),
      priority: 'Medium',
      status: 'Completed',
    },
    {
      campaign: techLaunch._id,
      creator: dev._id,
      assignedBy: aman._id,
      title: 'Submit YouTube Short',
      description: 'Unboxing + first-impressions short, 60 seconds max.',
      deadline: new Date('2026-09-28'),
      priority: 'High',
      status: 'Not Started',
    },
    {
      campaign: wellnessKit._id,
      creator: anaya._id,
      assignedBy: aman._id,
      title: 'Submit wellness routine Reel',
      description: 'Morning routine featuring the wellness kit.',
      deadline: new Date('2026-08-18'),
      priority: 'Medium',
      status: 'Under Review',
    },
  ]);

  // ---------- INVOICES (generated by Meera, the finance manager) ----------
  await Invoice.create([
    {
      campaign: summerStreetwear._id,
      creator: sarah._id,
      amount: 35000,
      issueDate: new Date('2026-09-18'),
      dueDate: new Date('2026-09-28'),
      status: 'Processing',
    },
    {
      campaign: wellnessKit._id,
      creator: anaya._id,
      amount: 12000,
      issueDate: new Date('2026-08-20'),
      dueDate: new Date('2026-08-30'),
      status: 'Paid',
    },
    {
      campaign: techLaunch._id,
      creator: dev._id,
      amount: 28000,
      issueDate: new Date('2026-09-26'),
      dueDate: new Date('2026-10-06'),
      status: 'Pending',
    },
  ]);

  console.log('\nSeed complete! Demo accounts (all use the same password):\n');
  console.log(`  Password for every account: ${DEMO_PASSWORD}\n`);
  console.log('  Creator  -> sarah@creator.com   (has an accepted proposal, 2 tasks, 1 invoice)');
  console.log('  Creator  -> dev@creator.com     (has a pending proposal, 1 task, 1 invoice)');
  console.log('  Creator  -> anaya@creator.com   (has 1 negotiating + 1 accepted proposal, 1 task)');
  console.log('  Brand    -> riya@brand.com      (owns all 3 campaigns, has proposals to review)');
  console.log('  Talent   -> aman@talent.com     (assigned all 4 tasks)');
  console.log('  Finance  -> meera@finance.com   (generated all 3 invoices)\n');

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
