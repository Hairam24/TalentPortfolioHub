import { useState, useEffect } from "react";
import WorkCard from "./work-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WorkItem } from "@/lib/types";
import { db, mockWorkData, initializeFirebase } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

interface WorkGridProps {
  category?: string;
  tag?: string;
  searchTerm?: string;
}

const WorkGrid = ({ category, tag, searchTerm }: WorkGridProps) => {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      try {
        let workItems: WorkItem[] = [];
        
        // Initialize Firebase
        const { db } = initializeFirebase();
        
        // Try to fetch from Firebase if db is available
        if (db) {
          try {
            const worksCollection = collection(db, "works");
            let workQuery = query(worksCollection, orderBy("createdAt", "desc"), limit(itemsPerPage));
            
            if (category && category !== "all") {
              workQuery = query(workQuery, where("category", "==", category));
            }
            
            if (tag) {
              workQuery = query(workQuery, where("tags", "array-contains", tag));
            }
            
            const querySnapshot = await getDocs(workQuery);
            
            if (!querySnapshot.empty) {
              querySnapshot.forEach((doc) => {
                workItems.push({
                  id: doc.id,
                  ...doc.data(),
                } as WorkItem);
              });
              console.log(`Found ${workItems.length} works in Firebase`);
            } else {
              console.log("No works found in Firebase, using mock data");
              workItems = [...mockWorkData];
            }
          } catch (firebaseError) {
            console.error("Error fetching from Firebase:", firebaseError);
            // Fall back to mock data if Firebase query fails
            workItems = [...mockWorkData];
          }
        } else {
          console.log("Firebase db not available, using mock data");
          // Use mock data if db is not available
          workItems = [...mockWorkData];
        }
        
        // Filter mock data if needed
        if (workItems.length > 0) {
          if (category && category !== "all") {
            workItems = workItems.filter(work => work.category === category);
          }
          
          if (tag) {
            workItems = workItems.filter(work => work.tags.includes(tag));
          }
        }
        
        // Filter by search term locally if provided
        const filteredWorks = searchTerm
          ? workItems.filter(
              (work) =>
                work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                work.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                work.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : workItems;
        
        setWorks(filteredWorks);
        setTotalPages(Math.max(1, Math.ceil(filteredWorks.length / itemsPerPage)));
      } catch (error) {
        console.error("Error fetching works:", error);
        setWorks([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, [category, tag, searchTerm]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-xl h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No works found</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Button
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                className={`relative inline-flex items-center px-4 py-2 border ${
                  page === i + 1
                    ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};

export default WorkGrid;
