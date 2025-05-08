import { useState, useEffect } from "react";
import ProjectCard from "./project-card";
import { Project } from "@/lib/types";
import { db } from "@/lib/firebase";
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
        let q = query(collection(db, "projects"), orderBy("dueDate", "asc"));
        
        if (status && status !== "All Projects") {
          q = query(q, where("status", "==", status));
        }
        
        if (client && client !== "All Clients") {
          q = query(q, where("client", "==", client));
        }
        
        const querySnapshot = await getDocs(q);
        const projectList: Project[] = [];
        
        querySnapshot.forEach((doc) => {
          const projectData = doc.data() as Project;
          projectList.push({
            id: doc.id,
            ...projectData,
          });
        });
        
        // Filter by assignee locally if needed
        if (assignee && assignee !== "All Team Members") {
          const filteredProjects = projectList.filter((project) =>
            project.team.some((member) => member.id === assignee)
          );
          setProjects(filteredProjects);
        } else {
          setProjects(projectList);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
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
