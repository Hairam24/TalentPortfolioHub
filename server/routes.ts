import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertTalentSchema, insertWorkSchema, insertProjectSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API routes prefix
  const apiRouter = express.Router();
  
  // ==================== User Routes ====================
  // Get all users
  apiRouter.get("/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: String(error) });
    }
  });
  
  // Get user by ID
  apiRouter.get("/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: String(error) });
    }
  });
  
  // Create user
  apiRouter.post("/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(validatedData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user", error: String(error) });
    }
  });
  
  // ==================== Talent Routes ====================
  // Get all talents
  apiRouter.get("/talents", async (req, res) => {
    try {
      const talents = await storage.getAllTalents();
      res.json(talents);
    } catch (error) {
      res.status(500).json({ message: "Error fetching talents", error: String(error) });
    }
  });
  
  // Get talent by ID
  apiRouter.get("/talents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const talent = await storage.getTalent(id);
      
      if (!talent) {
        return res.status(404).json({ message: "Talent not found" });
      }
      
      res.json(talent);
    } catch (error) {
      res.status(500).json({ message: "Error fetching talent", error: String(error) });
    }
  });
  
  // Create talent
  apiRouter.post("/talents", async (req, res) => {
    try {
      const validatedData = insertTalentSchema.parse(req.body);
      const newTalent = await storage.createTalent(validatedData);
      res.status(201).json(newTalent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating talent", error: String(error) });
    }
  });
  
  // ==================== Work Routes ====================
  // Get all works
  apiRouter.get("/works", async (req, res) => {
    try {
      const works = await storage.getAllWorks();
      res.json(works);
    } catch (error) {
      res.status(500).json({ message: "Error fetching works", error: String(error) });
    }
  });
  
  // Get work by ID
  apiRouter.get("/works/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const work = await storage.getWork(id);
      
      if (!work) {
        return res.status(404).json({ message: "Work not found" });
      }
      
      res.json(work);
    } catch (error) {
      res.status(500).json({ message: "Error fetching work", error: String(error) });
    }
  });
  
  // Create work
  apiRouter.post("/works", async (req, res) => {
    try {
      const validatedData = insertWorkSchema.parse(req.body);
      const newWork = await storage.createWork(validatedData);
      res.status(201).json(newWork);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating work", error: String(error) });
    }
  });
  
  // ==================== Project Routes ====================
  // Get all projects
  apiRouter.get("/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects", error: String(error) });
    }
  });
  
  // Get project by ID
  apiRouter.get("/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project", error: String(error) });
    }
  });
  
  // Create project
  apiRouter.post("/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(validatedData);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating project", error: String(error) });
    }
  });
  
  // Update project status
  apiRouter.patch("/projects/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedProject = await storage.updateProjectStatus(id, status);
      
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Error updating project status", error: String(error) });
    }
  });
  
  // Update project task
  apiRouter.patch("/projects/:projectId/tasks/:taskId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const taskId = parseInt(req.params.taskId);
      const { completed } = req.body;
      
      if (completed === undefined) {
        return res.status(400).json({ message: "Completed status is required" });
      }
      
      const updatedProject = await storage.updateProjectTask(projectId, taskId, completed);
      
      if (!updatedProject) {
        return res.status(404).json({ message: "Project or task not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Error updating project task", error: String(error) });
    }
  });

  // Mount API routes
  app.use("/api", apiRouter);

  return httpServer;
}
