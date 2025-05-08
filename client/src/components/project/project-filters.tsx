import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, List } from "lucide-react";

interface ProjectFiltersProps {
  onStatusChange: (status: string) => void;
  onAssigneeChange: (assignee: string) => void;
  onClientChange: (client: string) => void;
  onViewChange: (view: "grid" | "list") => void;
}

const statuses = [
  { value: "all", label: "All Projects" },
  { value: "In Progress", label: "In Progress" },
  { value: "On Hold", label: "On Hold" },
  { value: "Completed", label: "Completed" },
  { value: "Under Review", label: "Under Review" },
];

const teamMembers = [
  { value: "all", label: "All Team Members" },
  { value: "1", label: "Sarah Johnson" },
  { value: "2", label: "Michael Chen" },
  { value: "3", label: "Emily Rodriguez" },
  { value: "4", label: "Alex Wong" },
  { value: "5", label: "David Kim" },
  { value: "6", label: "Nina Patel" },
];

const ProjectFilters = ({ onStatusChange, onAssigneeChange, onClientChange, onViewChange }: ProjectFiltersProps) => {
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState("");

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusChange(value);
  };

  const handleAssigneeChange = (value: string) => {
    setAssignee(value);
    onAssigneeChange(value);
  };

  const handleViewChange = (view: "grid" | "list") => {
    setActiveView(view);
    onViewChange(view);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant={activeView === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("grid")}
            className={activeView === "grid" ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200" : ""}
          >
            <LayoutGrid className="mr-1 h-4 w-4" /> Card View
          </Button>
          <Button
            type="button"
            variant={activeView === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("list")}
            className={activeView === "list" ? "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200" : ""}
          >
            <List className="mr-1 h-4 w-4" /> List View
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assignee} onValueChange={handleAssigneeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Team Members" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.value} value={member.value}>
                  {member.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;
