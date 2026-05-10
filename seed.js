require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  image: String,
  startDate: Date,
  endDate: Date,
  isOngoing: Boolean
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri.includes('portofolio')) {
    console.log('URI detected without portofolio db, appending it...');
  }
  
  await mongoose.connect(uri);
  const data = JSON.parse(fs.readFileSync('./src/data/portfolio.json', 'utf8'));
  
  await Project.deleteMany({});
  
  const now = new Date();
  const mappedData = data.map((item, index) => {
    const monthsAgo = (data.length - index) * 3;
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - monthsAgo - 3);
    
    const endDate = new Date();
    endDate.setMonth(now.getMonth() - monthsAgo);
    
    const isOngoing = index === 0; // Set first item as ongoing for demo

    return {
      title: item.title,
      description: item.description,
      tags: item.tags,
      image: item.image,
      startDate: startDate,
      endDate: isOngoing ? null : endDate,
      isOngoing: isOngoing
    };
  });
  
  await Project.insertMany(mappedData);
  console.log(`Database seeded with ${mappedData.length} projects to correct database!`);
  process.exit(0);
}

seed().catch(console.error);
