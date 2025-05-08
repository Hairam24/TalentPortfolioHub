// Type definitions for the application

// Work showcase types
export interface WorkItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: any; // Firestore timestamp
}

// Talent profile types
export interface TalentProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  rating: number;
  skills: string[];
  location: string;
  availability: string;
  email: string;
  linkedIn?: string;
  website?: string;
  completedProjects: number;
  createdAt: any; // Firestore timestamp
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  status: string;
  dueDate: string;
  budget?: string;
  progress?: number;
  team: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  tasks: Array<{
    id: string;
    name: string;
    status: string;
    completed: boolean;
  }>;
  fileCount: number;
  commentCount: number;
  createdAt: any; // Firestore timestamp
}

// User profile types
export interface UserProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  skills: string[];
}

// Form types
export interface AddWorkFormValues {
  title: string;
  description: string;
  category: string;
  tags: string;
  creatorId: string;
}

export interface AddTalentFormValues {
  name: string;
  role: string;
  bio: string;
  skills: string;
  email: string;
  location: string;
  availability: string;
  linkedIn?: string;
  website?: string;
}

export interface AddProjectFormValues {
  title: string;
  description: string;
  client: string;
  dueDate: string;
  status: string;
  budget?: string;
}
