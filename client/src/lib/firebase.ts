import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { addDoc, collection, getDocs, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADkm9vL8TP_PgyGWMrEEP4PVKbzJ3trQ4", // Keeping placeholder for security in git
  authDomain: "profile-f9761.firebaseapp.com",
  databaseURL: "https://profile-f9761-default-rtdb.firebaseio.com",
  projectId: "profile-f9761",
  storageBucket: "profile-f9761.appspot.com",
  messagingSenderId: "1081932162726",
  appId: "1:1081932162726:web:0b48f1e6186d8526ed3667",
  measurementId: "G-ZCC88941H3"
};

// Mock data for demonstration purposes when Firebase is not available
export const mockWorkData = [
  {
    id: 'work1',
    title: 'Brand Logo Animation',
    description: 'Animated logo reveal for tech company',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-1.2.1&auto=format&fit=crop&w=512&h=384&q=80',
    category: 'Video Editing',
    tags: ['Animation', 'Logo', 'Video'],
    creator: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    },
    createdAt: new Date('2023-05-15'),
  },
  {
    id: 'work2',
    title: 'E-commerce Product Design',
    description: 'UI/UX design for fashion e-commerce app',
    imageUrl: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=512&h=384&q=80',
    category: 'UI/UX Design',
    tags: ['UI/UX', 'Mobile', 'E-commerce'],
    creator: {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    },
    createdAt: new Date('2023-06-22'),
  },
  {
    id: 'work3',
    title: 'Festival Promotional Video',
    description: 'Promotional video for annual music festival',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=512&h=384&q=80',
    category: 'Video Editing',
    tags: ['Video', 'Promo', 'Event'],
    creator: {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    },
    createdAt: new Date('2023-07-05'),
  },
  {
    id: 'work4',
    title: '3D Character Model',
    description: 'Animated character for mobile game',
    imageUrl: 'https://images.unsplash.com/photo-1611488006001-ee9d478e8e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=512&h=384&q=80',
    category: '3D Animation',
    tags: ['3D Model', 'Animation', 'Character'],
    creator: {
      id: '4',
      name: 'Alex Wong',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    },
    createdAt: new Date('2023-08-12'),
  },
  {
    id: 'work5',
    title: 'Luxury Brand Identity',
    description: 'Complete branding package for luxury brand',
    imageUrl: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=512&h=384&q=80',
    category: 'Graphic Design',
    tags: ['Logo', 'Branding', 'Identity'],
    creator: {
      id: '5',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    },
    createdAt: new Date('2023-09-03'),
  },
  {
    id: 'work6',
    title: 'Apparel Design Collection',
    description: 'T-shirt design collection for clothing brand',
    imageUrl: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=512&h=384&q=80',
    category: 'Graphic Design',
    tags: ['T-shirt', 'Apparel', 'Design'],
    creator: {
      id: '6',
      name: 'Nina Patel',
      avatar: 'https://images.unsplash.com/photo-1619970557451-6c1f07c69c11?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    },
    createdAt: new Date('2023-09-25'),
  },
];

export const mockTalentData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Video Editor',
    bio: 'Video editor with 5+ years of experience specializing in commercial and promotional content. Proficient in Adobe Premiere Pro and After Effects.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.8,
    skills: ['Adobe Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics'],
    location: 'Los Angeles, CA',
    availability: 'Available Now',
    email: 'sarah.j@example.com',
    linkedIn: 'https://linkedin.com/in/sarahjohnson',
    website: 'https://sarahjohnson.com',
    completedProjects: 32,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'UI/UX Designer',
    bio: 'Creative UI/UX designer focused on creating intuitive and engaging digital experiences. Strong background in mobile app and website design.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.9,
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
    location: 'San Francisco, CA',
    availability: 'Limited Availability',
    email: 'michael.c@example.com',
    linkedIn: 'https://linkedin.com/in/michaelchen',
    website: 'https://michaelchendesign.com',
    completedProjects: 45,
    createdAt: new Date('2023-02-10'),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Video Editor',
    bio: 'Passionate video editor with expertise in storytelling and narrative-driven content. Skilled in documentary and commercial editing.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.7,
    skills: ['Adobe Premiere Pro', 'Final Cut Pro', 'Storytelling', 'Sound Design'],
    location: 'New York, NY',
    availability: 'Available Now',
    email: 'emily.r@example.com',
    linkedIn: 'https://linkedin.com/in/emilyrodriguez',
    website: 'https://emilyrodriguezedits.com',
    completedProjects: 28,
    createdAt: new Date('2023-03-05'),
  },
  {
    id: '4',
    name: 'Alex Wong',
    role: '3D Animator',
    bio: '3D animator specializing in character animation and game assets. Experienced in creating engaging and dynamic animations for various platforms.',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.6,
    skills: ['Blender', 'Maya', 'Cinema 4D', 'Character Animation', 'Rigging'],
    location: 'Vancouver, Canada',
    availability: 'Limited Availability',
    email: 'alex.w@example.com',
    linkedIn: 'https://linkedin.com/in/alexwong',
    website: 'https://alexwong3d.com',
    completedProjects: 21,
    createdAt: new Date('2023-04-20'),
  },
  {
    id: '5',
    name: 'David Kim',
    role: 'Graphic Designer',
    bio: 'Versatile graphic designer with extensive experience in branding, logo design, and print materials. Strong focus on clean, impactful designs.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.9,
    skills: ['Adobe Illustrator', 'Photoshop', 'Brand Identity', 'Typography', 'Logo Design'],
    location: 'Chicago, IL',
    availability: 'Unavailable',
    email: 'david.k@example.com',
    linkedIn: 'https://linkedin.com/in/davidkim',
    website: 'https://davidkimdesign.com',
    completedProjects: 52,
    createdAt: new Date('2023-05-12'),
  },
  {
    id: '6',
    name: 'Nina Patel',
    role: 'Illustrator',
    bio: 'Illustrator and digital artist with a distinctive style. Specializes in character design, editorial illustrations, and concept art.',
    avatar: 'https://images.unsplash.com/photo-1619970557451-6c1f07c69c11?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80',
    rating: 4.8,
    skills: ['Adobe Illustrator', 'Procreate', 'Character Design', 'Digital Painting'],
    location: 'Austin, TX',
    availability: 'Available Now',
    email: 'nina.p@example.com',
    linkedIn: 'https://linkedin.com/in/ninapatel',
    website: 'https://ninapatelart.com',
    completedProjects: 38,
    createdAt: new Date('2023-06-15'),
  },
];

export const mockProjectData = [
  {
    id: 'proj1',
    title: 'Brand Refresh Campaign',
    description: 'Complete brand identity refresh for tech startup',
    client: 'TechNova',
    status: 'In Progress',
    dueDate: '2023-12-15',
    budget: '$5,000',
    team: [
      { id: '1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' },
      { id: '5', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' },
    ],
    tasks: [
      { id: 'task1', name: 'Logo Design', status: 'Completed', completed: true },
      { id: 'task2', name: 'Color Palette', status: 'Completed', completed: true },
      { id: 'task3', name: 'Brand Guidelines', status: 'In Progress', completed: false },
      { id: 'task4', name: 'Website Mockups', status: 'Not Started', completed: false },
    ],
    fileCount: 15,
    commentCount: 24,
    createdAt: new Date('2023-09-10'),
  },
  {
    id: 'proj2',
    title: 'Product Launch Video',
    description: 'Promotional video for new product launch',
    client: 'FitLife Gear',
    status: 'Under Review',
    dueDate: '2023-11-30',
    budget: '$3,500',
    team: [
      { id: '1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' },
      { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' },
    ],
    tasks: [
      { id: 'task5', name: 'Script Writing', status: 'Completed', completed: true },
      { id: 'task6', name: 'Filming', status: 'Completed', completed: true },
      { id: 'task7', name: 'Editing', status: 'Completed', completed: true },
      { id: 'task8', name: 'Client Review', status: 'In Progress', completed: false },
    ],
    fileCount: 8,
    commentCount: 15,
    createdAt: new Date('2023-10-05'),
  },
  {
    id: 'proj3',
    title: 'Website Redesign',
    description: 'Complete website redesign with improved UX/UI',
    client: 'Global Finance',
    status: 'Completed',
    dueDate: '2023-10-20',
    budget: '$8,000',
    team: [
      { id: '2', name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' },
      { id: '5', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' },
      { id: '6', name: 'Nina Patel', avatar: 'https://images.unsplash.com/photo-1619970557451-6c1f07c69c11?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' },
    ],
    tasks: [
      { id: 'task9', name: 'User Research', status: 'Completed', completed: true },
      { id: 'task10', name: 'Wireframing', status: 'Completed', completed: true },
      { id: 'task11', name: 'Visual Design', status: 'Completed', completed: true },
      { id: 'task12', name: 'Development', status: 'Completed', completed: true },
      { id: 'task13', name: 'Testing', status: 'Completed', completed: true },
    ],
    fileCount: 32,
    commentCount: 47,
    createdAt: new Date('2023-08-15'),
  },
  {
    id: 'proj4',
    title: 'Mobile App Animation',
    description: '3D character animations for mobile game',
    client: 'GameSphere',
    status: 'On Hold',
    dueDate: '2023-12-30',
    budget: '$4,200',
    team: [
      { id: '4', name: 'Alex Wong', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=120&q=80' },
    ],
    tasks: [
      { id: 'task14', name: 'Character Concept', status: 'Completed', completed: true },
      { id: 'task15', name: 'Model Creation', status: 'Completed', completed: true },
      { id: 'task16', name: 'Rigging', status: 'In Progress', completed: false },
      { id: 'task17', name: 'Animation', status: 'Not Started', completed: false },
    ],
    fileCount: 9,
    commentCount: 12,
    createdAt: new Date('2023-10-25'),
  },
];

// Initialize Firebase variables
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
let initialized = false;

export function initializeFirebase() {
  if (!initialized) {
    try {
      // Only initialize if we have valid Firebase credentials
      if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        storage = getStorage(app);
        auth = getAuth(app);
        console.log("Firebase initialized successfully");
      } else {
        console.warn("Firebase configuration is incomplete. Running in demo mode with limited functionality.");
        // We'll use mock data instead of Firebase in this case
      }
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      // Fall back to mock data
    } finally {
      // Mark as initialized regardless of success/failure
      initialized = true;
    }
  }
  
  return { app, db, storage, auth };
}

// Export Firebase services
export { app, db, storage, auth };

// Firestore functions already imported at the top of the file

// A function to create demo data if needed for development
export async function seedDemoData() {
  if (!db) {
    console.error('Firebase not initialized, cannot seed data');
    return false;
  }

  try {
    // Add work items
    const worksCollection = collection(db, "works");
    const worksSnapshot = await getDocs(worksCollection);
    
    if (worksSnapshot.empty) {
      console.log('Seeding works data...');
      for (const work of mockWorkData) {
        await addDoc(worksCollection, {
          ...work,
          createdAt: serverTimestamp()
        });
      }
      console.log('Works data seeded successfully');
    } else {
      console.log('Works collection already has data, skipping seed');
    }

    // Add talent profiles
    const talentsCollection = collection(db, "talents");
    const talentsSnapshot = await getDocs(talentsCollection);
    
    if (talentsSnapshot.empty) {
      console.log('Seeding talents data...');
      for (const talent of mockTalentData) {
        await addDoc(talentsCollection, {
          ...talent,
          createdAt: serverTimestamp()
        });
      }
      console.log('Talents data seeded successfully');
    } else {
      console.log('Talents collection already has data, skipping seed');
    }

    // Add projects
    const projectsCollection = collection(db, "projects");
    const projectsSnapshot = await getDocs(projectsCollection);
    
    if (projectsSnapshot.empty) {
      console.log('Seeding projects data...');
      for (const project of mockProjectData) {
        await addDoc(projectsCollection, {
          ...project,
          createdAt: serverTimestamp()
        });
      }
      console.log('Projects data seeded successfully');
    } else {
      console.log('Projects collection already has data, skipping seed');
    }

    return true;
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return false;
  }
}
