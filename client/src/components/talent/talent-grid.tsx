import { useState, useEffect } from "react";
import TalentCard from "./talent-card";
import { Button } from "@/components/ui/button";
import { TalentProfile } from "@/lib/types";
import { db, mockTalentData } from "@/lib/firebase";
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
        let talentProfiles: TalentProfile[] = [];
        
        // Try to fetch from Firebase if db is available
        if (db) {
          try {
            const talentsCollection = collection(db, "talents");
            let q = query(talentsCollection, orderBy("rating", "desc"));
            
            if (role && role !== "all") {
              q = query(q, where("role", "==", role));
            }
            
            if (availability && availability !== "all") {
              q = query(q, where("availability", "==", availability));
            }
            
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {
              talentProfiles.push({
                id: doc.id,
                ...doc.data(),
              } as TalentProfile);
            });
          } catch (firebaseError) {
            console.error("Error fetching from Firebase:", firebaseError);
            // Fall back to mock data if Firebase query fails
            talentProfiles = [...mockTalentData];
          }
        } else {
          // Use mock data if db is not available
          talentProfiles = [...mockTalentData];
        }
        
        // Apply filters to mock data if needed
        if (talentProfiles.length > 0) {
          if (role && role !== "all") {
            talentProfiles = talentProfiles.filter(profile => profile.role === role);
          }
          
          if (availability && availability !== "all") {
            talentProfiles = talentProfiles.filter(profile => profile.availability === availability);
          }
        }
        
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
        setProfiles([]);
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
