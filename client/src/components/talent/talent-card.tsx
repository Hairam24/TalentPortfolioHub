import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Briefcase, Clock, MapPin, Linkedin, Mail, Folder } from "lucide-react";
import { TalentProfile } from "@/lib/types";

interface TalentCardProps {
  profile: TalentProfile;
}

const TalentCard = ({ profile }: TalentCardProps) => {
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-16 w-16 rounded-full object-cover mr-4">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.role}</p>
            <div className="flex items-center mt-1">
              <div className="flex text-amber-400">
                {[...Array(Math.floor(profile.rating))].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                {profile.rating % 1 > 0 && (
                  <Star className="h-4 w-4 fill-current stroke-current" />
                )}
                {[...Array(5 - Math.ceil(profile.rating))].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{profile.rating}</span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                {skill}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{profile.bio}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Clock className="mr-1 h-4 w-4" />
          <span>
            {profile.availability === "Available Now" ? (
              <span className="text-green-500 font-medium">Available Now</span>
            ) : profile.availability === "Limited Availability" ? (
              <span className="text-amber-500 font-medium">Limited Availability</span>
            ) : (
              <span className="text-red-500 font-medium">Unavailable</span>
            )}
          </span>
          <span className="mx-2">•</span>
          <MapPin className="mr-1 h-4 w-4" />
          <span>{profile.location}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800">
            <Linkedin className="mr-1 h-4 w-4" /> LinkedIn
          </Button>
          <Button variant="outline" size="sm" className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Mail className="mr-1 h-4 w-4" /> Contact
          </Button>
          <Button variant="outline" size="sm" className="flex items-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Folder className="mr-1 h-4 w-4" /> View Portfolio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentCard;
