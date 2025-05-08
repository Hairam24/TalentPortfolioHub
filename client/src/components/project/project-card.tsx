import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/lib/types";
import { Calendar, DollarSign, MessageSquare, FileText, Edit, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  // Calculate progress based on completed tasks
  const completedTasks = project.tasks.filter((task) => task.completed).length;
  const progressPercentage = (completedTasks / project.tasks.length) * 100;

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100">
            In Progress
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
            Completed
          </Badge>
        );
      case "On Hold":
        return (
          <Badge className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100">
            On Hold
          </Badge>
        );
      case "Under Review":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
            Under Review
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                {project.title}
              </h3>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {project.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="mr-4 inline-flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {project.status === "Completed" ? "Completed: " : "Due: "}
                {project.dueDate}
              </span>
              <span className="inline-flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Client: {project.client}
              </span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex flex-col items-end">
              <div className="flex -space-x-2 mb-2">
                {project.team.map((member) => (
                  <Avatar key={member.id} className="h-8 w-8 ring-2 ring-white dark:ring-gray-800">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {project.team.length > 3 && (
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium ring-2 ring-white dark:ring-gray-800">
                    +{project.team.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {project.team.length} team member{project.team.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} />
        </div>

        <div className="border-t dark:border-gray-700 pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Task Breakdown
          </h4>
          <div className="space-y-2">
            {project.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id={`task-${task.id}`} checked={task.completed} />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`ml-2 block text-sm ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {task.name}
                  </label>
                </div>
                <span className={`text-xs font-medium ${
                  task.completed
                    ? "text-green-600 dark:text-green-400"
                    : task.status === "In Progress"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <div className="flex space-x-4">
          <span className="inline-flex items-center text-sm">
            <FileText className="w-5 h-5 mr-1 text-gray-500 dark:text-gray-400" />
            {project.fileCount} files
          </span>
          <span className="inline-flex items-center text-sm">
            <MessageSquare className="w-5 h-5 mr-1 text-gray-500 dark:text-gray-400" />
            {project.commentCount} comments
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Edit className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Clock className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
