const { query } = require("express");
const Project = require("../models/Project.js");
const fs = require('fs');
const path = require('path');

exports.getAllProjects = async () => {
  return await Project.find().sort({ createdAt: -1 });
};

// Get a single project by ID
exports.getProjectById = async (id) => {
  return await Project.findById(id);
};

// Create a new project
exports.createProject = async (projectData) => {
  const newProject = new Project(projectData);
  return await newProject.save();
};

// Update a project
exports.updateProject = async (id, updatedData) => {
  try {
    const project = await Project.findByIdAndUpdate(id, updatedData, { new: true });
    return project;
  } catch (error) {
    throw new Error('Error updating project: ' + error.message);
  }
};

// Delete a project
exports.deleteProject = async (id) => {
  const project = await Project.findById(id);
  
  if (project && project.screenshot) {
    // Remove the image file if it exists
    const filePath = path.join(__dirname, '../public', project.screenshot);
    try {
      if (fs.existsSync(filePath) && !project.screenshot.startsWith('/image/')) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  
  return await Project.findByIdAndDelete(id);
};

// Search for projects
exports.searchProjects = async (query) => {
  if (!query) return [];
  
  // Try text search first
  const textResults = await Project.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
  
  // If no results, try regex search
  if (textResults.length === 0) {
    return await Project.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { summary: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tech: { $in: [new RegExp(query, 'i')] } }
      ]
    });
  }
  
  return textResults;
};