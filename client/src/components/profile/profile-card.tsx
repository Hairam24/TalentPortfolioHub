import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, Edit } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0 p-6 md:p-8 flex flex-col items-center">
          <Avatar className="h-32 w-32 rounded-full object-cover">
            <AvatarImage src={profile.avatar} alt="Profile picture" />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.role}</p>
            <div className="mt-2 flex justify-center">
              <Badge className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                Available for Projects
              </Badge>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" className="text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800">
              <Linkedin className="mr-1 h-4 w-4" /> LinkedIn
            </Button>
            <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <Mail className="mr-1 h-4 w-4" /> Email
            </Button>
            <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <Edit className="mr-1 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
        <div className="p-6 md:p-8 md:flex-1">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About Me</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {profile.bio}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-700 dark:text-gray-300">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-gray-700 dark:text-gray-300">{profile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-gray-700 dark:text-gray-300">{profile.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                <p className="text-gray-700 dark:text-gray-300">{profile.website}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
