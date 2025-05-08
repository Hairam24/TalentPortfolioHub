import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface WorkFiltersProps {
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
  onSearchChange: (search: string) => void;
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Video Editing", label: "Video Editing" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "3D Animation", label: "3D Animation" },
  { value: "Logo Design", label: "Logo Design" },
  { value: "UI/UX Design", label: "UI/UX Design" },
];

const tags = [
  "Logo",
  "3D Model",
  "Animation",
  "Video",
  "Poster",
  "T-shirt",
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "alphabetical", label: "Alphabetical" },
];

const WorkFilters = ({ onCategoryChange, onTagChange, onSearchChange }: WorkFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeTagIndex, setActiveTagIndex] = useState(-1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onCategoryChange(value);
  };

  const handleTagClick = (tag: string, index: number) => {
    if (activeTagIndex === index) {
      // Deselect the tag
      setSelectedTag("");
      setActiveTagIndex(-1);
      onTagChange("");
    } else {
      // Select the tag
      setSelectedTag(tag);
      setActiveTagIndex(index);
      onTagChange(tag);
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
              name="search"
              id="search"
              className="pl-10 pr-12"
              placeholder="Search by title, tag, or artist..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select defaultValue="recent">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={tag}
            variant="outline"
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition ${
              activeTagIndex === index
                ? "bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => handleTagClick(tag, index)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default WorkFilters;
