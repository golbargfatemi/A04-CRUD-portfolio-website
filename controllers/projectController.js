const projectOps = require("../data/projectOps");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await projectOps.getAllProjects();
    res.render("projects", {
      title: "My Projects",
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).render("500", {
      title: "Error",
      message: "Failed to load projects",
    });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await projectOps.getProjectById(req.params.id);

    if (!project) {
      return res.status(404).render("404", {
        title: "Project Not Found",
      });
    }

    res.render("project-detail", {
      title: project.title,
      project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).render("500", {
      title: "Error",
      message: "Failed to load project details",
    });
  }
};

// Search for projects
exports.searchProjects = async (req, res) => {
  try {
    const query = req.query.query ? req.query.query.toLowerCase() : "";
    const results = await projectOps.searchProjects(query);

    res.render("search-results", {
      title: `Search Results: ${query}`,
      query,
      results,
    });
  } catch (error) {
    console.error("Error searching projects:", error);
    res.status(500).render("500", {
      title: "Error",
      message: "Failed to search projects",
    });
  }
};

exports.create = (req, res) => {
  try {
    res.render("create-project", {
      title: "Create New Project",
      project: {},
      formAction: "/projects",
      formMethod: "POST",
    });
  } catch (error) {
    console.error("Error rendering create form:", error);
    res.status(500).send("Error rendering form: " + error.message);
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const projectData = {
      title: req.body.title,
      summary: req.body.summary,
      description: req.body.description,
      tech: req.body.tech.split(",").map((item) => item.trim()),
      screenshot: req.file
        ? `/image/uploads/${req.file.filename}`
        : "/image/default-project.png",
    };

    await projectOps.createProject(projectData);
    req.flash("success", "Project created successfully!");
    res.redirect("/projects");
  } catch (error) {
    console.error("Error creating project:", error);
    req.flash("error", "Failed to create project");
    res.redirect("/projects/create");
  }
};

// Show form to edit a project
exports.showEditForm = async (req, res) => {
  try {
    const project = await projectOps.getProjectById(req.params.id);

    if (!project) {
      req.flash("error", "Project not found");
      return res.redirect("/projects");
    }

    res.render("edit-project", {
      title: "Edit Project",
      project,
      formAction: `/projects/${project._id}/update`,
      formMethod: "POST",
    });
  } catch (error) {
    console.error("Error fetching project for edit:", error);
    req.flash("error", "Failed to load project for editing");
    res.redirect("/projects");
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const project = await projectOps.getProjectById(req.params.id);

    if (!project) {
      req.flash("error", "Project not found");
      return res.redirect("/projects");
    }

    const projectData = {
      title: req.body.title,
      summary: req.body.summary,
      description: req.body.description,
      tech: req.body.tech.split(",").map((item) => item.trim()),
    };

    if (req.file) {
      // Delete the old image if it exists and is not a default image
      if (project.screenshot && !project.screenshot.startsWith("/image/")) {
        const oldImagePath = path.join(
          __dirname,
          "../public",
          project.screenshot
        );
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      projectData.screenshot = `/image/uploads/${req.file.filename}`;
    }

    await projectOps.updateProject(req.params.id, projectData);
    req.flash("success", "Project updated successfully!");
    res.redirect(`/projects/${req.params.id}`);
  } catch (error) {
    console.error("Error updating project:", error);
    req.flash("error", "Failed to update project");
    res.redirect(`/projects/${req.params.id}/edit`);
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    await projectOps.deleteProject(req.params.id);
    req.flash("success", "Project deleted successfully!");
    res.redirect("/projects");
  } catch (error) {
    console.error("Error deleting project:", error);
    req.flash("error", "Failed to delete project");
    res.redirect("/projects");
  }
};
