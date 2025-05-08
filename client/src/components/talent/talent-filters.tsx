import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface TalentFiltersProps {
  onRoleChange: (role: string) => void;
  onSkillChange: (skill: string) => void;
  onAvailabilityChange: (availability: string) => void;
  onSearchChange: (search: string) => void;
}

const roles = [
  { value: "all", label: "All Roles" },
  { value: "Graphic Designer", label: "Graphic Designer" },
  { value: "Video Editor", label: "Video Editor" },
  { value: "3D Animator", label: "3D Animator" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "Illustrator", label: "Illustrator" },
  { value: "Logo Designer", label: "Logo Designer" },
];

const availabilityOptions = [
  { value: "all", label: "All Availability" },
  { value: "Available Now", label: "Available Now" },
  { value: "Limited Availability", label: "Limited Availability" },
  { value: "Unavailable", label: "Unavailable" },
];

const skills = [
  "Adobe Photoshop",
  "After Effects",
  "Figma",
  "Blender",
  "Premiere Pro",
  "Illustrator",
];

const TalentFilters = ({ onRoleChange, onSkillChange, onAvailabilityChange, onSearchChange }: TalentFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [activeSkillIndex, setActiveSkillIndex] = useState(-1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    onRoleChange(value);
  };

  const handleAvailabilityChange = (value: string) => {
    setSelectedAvailability(value);
    onAvailabilityChange(value);
  };

  const handleSkillClick = (skill: string, index: number) => {
    if (activeSkillIndex === index) {
      // Deselect the skill
      setSelectedSkill("");
      setActiveSkillIndex(-1);
      onSkillChange("");
    } else {
      // Select the skill
      setSelectedSkill(skill);
      setActiveSkillIndex(index);
      onSkillChange(skill);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-grow">
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              name="search-talents"
              id="search-talents"
              className="pl-10 pr-12"
              placeholder="Search by name, role, or skill..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedAvailability} onValueChange={handleAvailabilityChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Availability" />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={skill}
            variant="outline"
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition ${
              activeSkillIndex === index
                ? "bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => handleSkillClick(skill, index)}
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TalentFilters;
