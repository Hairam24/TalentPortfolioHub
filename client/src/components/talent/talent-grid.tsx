import { useState, useEffect } from "react";
import TalentCard from "./talent-card";
import { Button } from "@/components/ui/button";
import { TalentProfile } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

interface TalentGridProps {
  role?: string;
  skill?: string;
  availability?: string;
  searchTerm?: string;
}

const TalentGrid = ({ role, skill, availability, searchTerm }: TalentGridProps) => {
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, "talents"), orderBy("rating", "desc"));
        
        if (role && role !== "All Roles") {
          q = query(q, where("role", "==", role));
        }
        
        if (availability && availability !== "All Availability") {
          q = query(q, where("availability", "==", availability));
        }
        
        const querySnapshot = await getDocs(q);
        const talentProfiles: TalentProfile[] = [];
        
        querySnapshot.forEach((doc) => {
          talentProfiles.push({
            id: doc.id,
            ...doc.data(),
          } as TalentProfile);
        });
        
        // Filter by search term and skills locally
        let filteredProfiles = talentProfiles;
        
        if (searchTerm) {
          filteredProfiles = filteredProfiles.filter(
            (profile) =>
              profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              profile.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
              profile.bio.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (skill) {
          filteredProfiles = filteredProfiles.filter(
            (profile) => profile.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
          );
        }
        
        setProfiles(filteredProfiles);
      } catch (error) {
        console.error("Error fetching talent profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [role, skill, availability, searchTerm]);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-xl h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No profiles found</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.slice(0, visibleCount).map((profile) => (
          <TalentCard key={profile.id} profile={profile} />
        ))}
      </div>

      {visibleCount < profiles.length && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            variant="outline"
          >
            Load More Profiles ({profiles.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </>
  );
};

export default TalentGrid;
