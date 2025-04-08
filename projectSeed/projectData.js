require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');

//JSON data
const projectsData = [
    {
        "title": "Color Detection Game",
        "summary": "Web-based game where players must to identify subtle differences between colors.",
        "description": "The objective is to select the one square that slightly differs from the rest. As levels progress, the number of squares increases, and color variations become more difficult to detect. Players have 60 seconds to complete as many levels as possible, but the timer does not decrease when they get score",
        "tech": ["JavaScript", "HTML", "CSS"],
        "screenshot": "/image/Color-Detection-Game.png"
    },
    {
        "title": "Calculator App",
        "summary": "This project is fully functional calculator application with a user interface.",
        "description": "The calculator app contains essential arithmetic operations, memory functions, and advanced features like percentage and square root calculations. The application ensures a user-friendly experience with a responsive layout.",
        "tech": ["React", "HTML", "CSS"],
        "screenshot": "/image/Calculator.png"
    },
    {
        "title": "Project-Dashboard",
        "summary": "This project focus on interface and data set up, component structure and Project service.",
        "description": "Project managment dashboard using angular. The goal is to focus on component communication, custom pipes, services and responsive design.",
        "tech": ["Angular", "TypeScript", "HTML", "CSS"],
        "screenshot": "/image/Project-Dashboard.png"
    }
];

// Connect to MongoDB
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects');
    
    // Insert projects
    const insertedProjects = await Project.insertMany(projectsData);
    console.log(`Added ${insertedProjects.length} projects to database`);
    
    console.log('Database seeded successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();