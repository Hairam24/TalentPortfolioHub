import { useState } from "react";
import { Helmet } from "react-helmet";
import ProjectList from "@/components/project/project-list";
import ProjectFilters from "@/components/project/project-filters";
import AddProjectDialog from "@/components/project/add-project-dialog";

const Projects = () => {
  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState("");
  const [client, setClient] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleAssigneeChange = (value: string) => {
    setAssignee(value);
  };

  const handleClientChange = (value: string) => {
    setClient(value);
  };

  const handleViewChange = (viewMode: "grid" | "list") => {
    setView(viewMode);
  };

  return (
    <>
      <Helmet>
        <title>Project Tracker - Profile1</title>
        <meta name="description" content="Track all ongoing projects, their status, and assigned team members in one place." />
        <meta property="og:title" content="Project Tracker - Profile1" />
        <meta property="og:description" content="Monitor progress, deadlines, and team assignments for all your creative projects." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Tracker</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage and track all ongoing projects</p>
          </div>

          <AddProjectDialog />
        </div>

        <ProjectFilters
          onStatusChange={handleStatusChange}
          onAssigneeChange={handleAssigneeChange}
          onClientChange={handleClientChange}
          onViewChange={handleViewChange}
        />

        <ProjectList
          status={status}
          assignee={assignee}
          client={client}
        />
      </div>
    </>
  );
};

export default Projects;
