import { useState, useEffect } from "react";
import ProjectCard from "./project-card";
import { Project } from "@/lib/types";
import { db, mockProjectData, initializeFirebase } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

interface ProjectListProps {
  status?: string;
  assignee?: string;
  client?: string;
}

const ProjectList = ({ status, assignee, client }: ProjectListProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        let projectList: Project[] = [];
        
        // Initialize Firebase
        const { db } = initializeFirebase();
        
        // Try to fetch from Firebase if db is available
        if (db) {
          try {
            const projectsCollection = collection(db, "projects");
            let projectQuery = query(projectsCollection, orderBy("dueDate", "asc"));
            
            if (status && status !== "all") {
              projectQuery = query(projectQuery, where("status", "==", status));
            }
            
            if (client && client !== "all") {
              projectQuery = query(projectQuery, where("client", "==", client));
            }
            
            const querySnapshot = await getDocs(projectQuery);
            
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                projectList.push({
                  id: doc.id,
                  ...doc.data()
                } as Project);
              });
              console.log(`Found ${projectList.length} projects in Firebase`);
            } else {
              console.log("No projects found in Firebase, using mock data");
              projectList = [...mockProjectData];
            }
          } catch (firebaseError) {
            console.error("Error fetching from Firebase:", firebaseError);
            // Fall back to mock data if Firebase query fails
            projectList = [...mockProjectData];
          }
        } else {
          console.log("Firebase db not available, using mock data");
          // Use mock data if db is not available
          projectList = [...mockProjectData];
        }
        
        // Apply filters to mock data if needed
        if (projectList.length > 0 && projectList[0].id.startsWith('proj')) {
          if (status && status !== "all") {
            projectList = projectList.filter(project => project.status === status);
          }
          
          if (client && client !== "all") {
            projectList = projectList.filter(project => project.client === client);
          }
        }
        
        // Filter by assignee locally if needed
        if (assignee && assignee !== "all") {
          projectList = projectList.filter((project) =>
            project.team.some((member) => member.id === assignee)
          );
        }
        
        setProjects(projectList);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [status, assignee, client]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-xl h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your filters or add a new project.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
