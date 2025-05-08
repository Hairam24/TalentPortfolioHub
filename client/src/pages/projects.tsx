import { useState } from "react";
import { Helmet } from "react-helmet";
import ProjectList from "@/components/project/project-list";
import ProjectFilters from "@/components/project/project-filters";
import AddProjectDialog from "@/components/project/add-project-dialog";
import { Button } from "@/components/ui/button";
import { seedDemoData } from "@/lib/firebase";

const Projects = () => {
  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState("");
  const [client, setClient] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [seeding, setSeeding] = useState(false);
  
  const handleSeedData = async () => {
    try {
      setSeeding(true);
      const result = await seedDemoData();
      if (result) {
        alert("Demo data seeded successfully! Refresh the page to see the changes.");
      } else {
        alert("Failed to seed demo data. Check console for details.");
      }
    } catch (error) {
      console.error("Error seeding demo data:", error);
      alert("An error occurred while seeding demo data.");
    } finally {
      setSeeding(false);
    }
  };

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
        <title>Project Tracker - CreativePulse</title>
        <meta name="description" content="Track all ongoing projects, their status, and assigned team members in one place." />
        <meta property="og:title" content="Project Tracker - CreativePulse" />
        <meta property="og:description" content="Monitor progress, deadlines, and team assignments for all your creative projects." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Tracker</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage and track all ongoing projects</p>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button
              onClick={handleSeedData}
              disabled={seeding}
              variant="outline"
              size="sm"
              className="hidden md:flex"
            >
              {seeding ? "Seeding..." : "Seed Demo Data"}
            </Button>
            <AddProjectDialog />
          </div>
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
