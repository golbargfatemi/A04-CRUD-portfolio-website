const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tech: {
    type: [String],
    required: true,
  },
  screenshot: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ProjectSchema.index({ 
  title: 'text', 
  summary: 'text', 
  description: 'text' 
});

module.exports = mongoose.model("Project", ProjectSchema);
