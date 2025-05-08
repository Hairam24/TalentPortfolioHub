import { 
  users, talents, works, projects, projectTasks, projectTeam,
  type User, type Talent, type Work, type Project, type ProjectTask, type ProjectTeam,
  type InsertUser, type InsertTalent, type InsertWork, type InsertProject
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Talent operations
  getTalent(id: number): Promise<Talent | undefined>;
  getAllTalents(): Promise<Talent[]>;
  getTalentsBySkill(skill: string): Promise<Talent[]>;
  getTalentsByAvailability(availability: string): Promise<Talent[]>;
  createTalent(talent: InsertTalent): Promise<Talent>;
  
  // Work operations
  getWork(id: number): Promise<Work | undefined>;
  getAllWorks(): Promise<Work[]>;
  getWorksByCategory(category: string): Promise<Work[]>;
  getWorksByTag(tag: string): Promise<Work[]>;
  getWorksByCreator(creatorId: number): Promise<Work[]>;
  createWork(work: InsertWork): Promise<Work>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getProjectsByStatus(status: string): Promise<Project[]>;
  getProjectsByClient(client: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProjectStatus(id: number, status: string): Promise<Project | undefined>;
  updateProjectTask(projectId: number, taskId: number, completed: boolean): Promise<Project | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private talents: Map<number, Talent>;
  private works: Map<number, Work>;
  private projects: Map<number, Project>;
  private projectTasks: Map<number, ProjectTask>;
  private projectTeam: Map<number, ProjectTeam>;
  
  private currentUserId: number;
  private currentTalentId: number;
  private currentWorkId: number;
  private currentProjectId: number;
  private currentTaskId: number;
  private currentTeamId: number;

  constructor() {
    this.users = new Map();
    this.talents = new Map();
    this.works = new Map();
    this.projects = new Map();
    this.projectTasks = new Map();
    this.projectTeam = new Map();
    
    this.currentUserId = 1;
    this.currentTalentId = 1;
    this.currentWorkId = 1;
    this.currentProjectId = 1;
    this.currentTaskId = 1;
    this.currentTeamId = 1;
  }

  // ==================== User Methods ====================
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // ==================== Talent Methods ====================
  async getTalent(id: number): Promise<Talent | undefined> {
    return this.talents.get(id);
  }

  async getAllTalents(): Promise<Talent[]> {
    return Array.from(this.talents.values());
  }

  async getTalentsBySkill(skill: string): Promise<Talent[]> {
    return Array.from(this.talents.values()).filter(
      (talent) => talent.skills && talent.skills.includes(skill)
    );
  }

  async getTalentsByAvailability(availability: string): Promise<Talent[]> {
    return Array.from(this.talents.values()).filter(
      (talent) => talent.availability === availability
    );
  }

  async createTalent(insertTalent: InsertTalent): Promise<Talent> {
    const id = this.currentTalentId++;
    const now = new Date();
    const talent: Talent = { 
      ...insertTalent, 
      id, 
      rating: 0,
      completedProjects: 0,
      createdAt: now
    };
    this.talents.set(id, talent);
    return talent;
  }

  // ==================== Work Methods ====================
  async getWork(id: number): Promise<Work | undefined> {
    return this.works.get(id);
  }

  async getAllWorks(): Promise<Work[]> {
    return Array.from(this.works.values());
  }

  async getWorksByCategory(category: string): Promise<Work[]> {
    return Array.from(this.works.values()).filter(
      (work) => work.category === category
    );
  }

  async getWorksByTag(tag: string): Promise<Work[]> {
    return Array.from(this.works.values()).filter(
      (work) => work.tags && work.tags.includes(tag)
    );
  }

  async getWorksByCreator(creatorId: number): Promise<Work[]> {
    return Array.from(this.works.values()).filter(
      (work) => work.creatorId === creatorId
    );
  }

  async createWork(insertWork: InsertWork): Promise<Work> {
    const id = this.currentWorkId++;
    const now = new Date();
    const work: Work = { 
      ...insertWork, 
      id, 
      createdAt: now
    };
    this.works.set(id, work);
    return work;
  }

  // ==================== Project Methods ====================
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.status === status
    );
  }

  async getProjectsByClient(client: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.client === client
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      fileCount: 0,
      commentCount: 0,
      createdAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProjectStatus(id: number, status: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    
    if (project) {
      const updatedProject: Project = {
        ...project,
        status
      };
      this.projects.set(id, updatedProject);
      return updatedProject;
    }
    
    return undefined;
  }

  async updateProjectTask(projectId: number, taskId: number, completed: boolean): Promise<Project | undefined> {
    const project = this.projects.get(projectId);
    
    if (!project || !project.tasks) {
      return undefined;
    }
    
    // Parse tasks if stored as a JSON string
    let tasks;
    if (typeof project.tasks === 'string') {
      try {
        tasks = JSON.parse(project.tasks);
      } catch (e) {
        console.error('Error parsing project tasks:', e);
        return undefined;
      }
    } else {
      tasks = project.tasks;
    }
    
    // Update the task
    const taskIndex = tasks.findIndex((task: any) => task.id === taskId);
    
    if (taskIndex === -1) {
      return undefined;
    }
    
    tasks[taskIndex].completed = completed;
    tasks[taskIndex].status = completed ? 'Completed' : 'In Progress';
    
    // Update the project
    const updatedProject: Project = {
      ...project,
      tasks
    };
    
    this.projects.set(projectId, updatedProject);
    return updatedProject;
  }
}

export const storage = new MemStorage();
