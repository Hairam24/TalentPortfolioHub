import { useState } from "react";
import { Helmet } from "react-helmet";
import TalentGrid from "@/components/talent/talent-grid";
import TalentFilters from "@/components/talent/talent-filters";
import AddTalentDialog from "@/components/talent/add-talent-dialog";

const Talents = () => {
  const [role, setRole] = useState("");
  const [skill, setSkill] = useState("");
  const [availability, setAvailability] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  const handleSkillChange = (value: string) => {
    setSkill(value);
  };

  const handleAvailabilityChange = (value: string) => {
    setAvailability(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <>
      <Helmet>
        <title>Talent Profiles - Profile1</title>
        <meta name="description" content="Find the perfect creative professional for your project from our network of talented freelancers." />
        <meta property="og:title" content="Talent Profiles - Profile1" />
        <meta property="og:description" content="Browse our network of talented freelancers including designers, editors, animators, and more." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Talent Profiles</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Find the perfect creative professional for your project</p>
          </div>

          <AddTalentDialog />
        </div>

        <TalentFilters
          onRoleChange={handleRoleChange}
          onSkillChange={handleSkillChange}
          onAvailabilityChange={handleAvailabilityChange}
          onSearchChange={handleSearchChange}
        />

        <TalentGrid
          role={role}
          skill={skill}
          availability={availability}
          searchTerm={searchTerm}
        />
      </div>
    </>
  );
};

export default Talents;
