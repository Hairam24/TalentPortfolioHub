import { pgTable, text, serial, integer, boolean, json, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  phone: text("phone"),
  location: text("location"),
  website: text("website"),
  skills: text("skills").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Talents table
export const talents = pgTable("talents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar"),
  rating: integer("rating").default(0),
  skills: text("skills").array(),
  location: text("location").notNull(),
  availability: text("availability").notNull(),
  email: text("email").notNull(),
  linkedIn: text("linkedin"),
  website: text("website"),
  completedProjects: integer("completed_projects").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Works table
export const works = pgTable("works", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  creatorId: integer("creator_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  client: text("client").notNull(),
  status: text("status").notNull(),
  dueDate: text("due_date").notNull(),
  budget: text("budget"),
  tasks: json("tasks").notNull(),
  team: json("team").notNull(),
  fileCount: integer("file_count").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Project tasks junction table
export const projectTasks = pgTable("project_tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Project team junction table
export const projectTeam = pgTable("project_team", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  talentId: integer("talent_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});

export const insertTalentSchema = createInsertSchema(talents).omit({ 
  id: true, 
  createdAt: true,
  rating: true,
  completedProjects: true
});

export const insertWorkSchema = createInsertSchema(works).omit({ 
  id: true, 
  createdAt: true 
});

export const insertProjectSchema = createInsertSchema(projects).omit({ 
  id: true, 
  createdAt: true,
  fileCount: true,
  commentCount: true
});

export const insertProjectTaskSchema = createInsertSchema(projectTasks).omit({ 
  id: true, 
  createdAt: true 
});

export const insertProjectTeamSchema = createInsertSchema(projectTeam).omit({ 
  id: true, 
  createdAt: true 
});

// Create types from schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTalent = z.infer<typeof insertTalentSchema>;
export type Talent = typeof talents.$inferSelect;

export type InsertWork = z.infer<typeof insertWorkSchema>;
export type Work = typeof works.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertProjectTask = z.infer<typeof insertProjectTaskSchema>;
export type ProjectTask = typeof projectTasks.$inferSelect;

export type InsertProjectTeam = z.infer<typeof insertProjectTeamSchema>;
export type ProjectTeam = typeof projectTeam.$inferSelect;
