import { useState } from "react";
import { Helmet } from "react-helmet";
import WorkGrid from "@/components/work/work-grid";
import WorkFilters from "@/components/work/work-filters";
import AddWorkDialog from "@/components/work/add-work-dialog";
import { Button } from "@/components/ui/button";
import { seedDemoData } from "@/lib/firebase";

const Showcase = () => {
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleTagChange = (value: string) => {
    setTag(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <>
      <Helmet>
        <title>Work Showcase - CreativePulse</title>
        <meta name="description" content="Browse our collection of creative work from talented freelancers including graphics, videos, animations, and more." />
        <meta property="og:title" content="Work Showcase - CreativePulse" />
        <meta property="og:description" content="Discover the portfolio of creative work from our network of talented freelancers." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Work Showcase</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Browse creative work from our talented network</p>
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
            <AddWorkDialog />
          </div>
        </div>

        <WorkFilters 
          onCategoryChange={handleCategoryChange}
          onTagChange={handleTagChange}
          onSearchChange={handleSearchChange}
        />

        <WorkGrid 
          category={category}
          tag={tag}
          searchTerm={searchTerm}
        />
      </div>
    </>
  );
};

export default Showcase;
