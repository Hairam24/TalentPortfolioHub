import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WorkItem } from "@/lib/types";

interface WorkCardProps {
  work: WorkItem;
}

const WorkCard = ({ work }: WorkCardProps) => {
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 group">
      <div className="relative pb-[75%] overflow-hidden">
        <img 
          className="absolute h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          src={work.imageUrl} 
          alt={work.title} 
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
            {work.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{work.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{work.description}</p>
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={work.creator.avatar} alt={work.creator.name} />
            <AvatarFallback>{work.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{work.creator.name}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkCard;
