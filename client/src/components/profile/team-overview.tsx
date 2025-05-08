import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, FolderIcon, CheckIcon } from "lucide-react";
import { TalentProfile } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const TeamOverview = () => {
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    teamSize: 0,
    activeProjects: 0,
    completedProjects: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch talents
        const talentsSnapshot = await getDocs(collection(db, "talents"));
        const talentsList: TalentProfile[] = [];
        talentsSnapshot.forEach((doc) => {
          talentsList.push({
            id: doc.id,
            ...doc.data(),
          } as TalentProfile);
        });
        setTalents(talentsList);
        
        // Fetch projects to calculate stats
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        let activeCount = 0;
        let completedCount = 0;
        
        projectsSnapshot.forEach((doc) => {
          const project = doc.data();
          if (project.status === "Completed") {
            completedCount++;
          } else {
            activeCount++;
          }
        });
        
        setStats({
          teamSize: talentsList.length,
          activeProjects: activeCount,
          completedProjects: completedCount,
        });
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="border-t dark:border-gray-700">
      <div className="p-6 md:p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Team Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <CardContent className="p-0">
              <div className="flex items-center mb-2">
                <UserIcon className="text-xl text-primary-500 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Team Size</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.teamSize}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active freelancers</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <CardContent className="p-0">
              <div className="flex items-center mb-2">
                <FolderIcon className="text-xl text-primary-500 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Projects</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeProjects}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active projects</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <CardContent className="p-0">
              <div className="flex items-center mb-2">
                <CheckIcon className="text-xl text-primary-500 mr-2" />
                <h4 className="font-medium text-gray-900 dark:text-white">Completed</h4>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedProjects}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Projects this year</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Team Availability</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Current Projects
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Availability
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {talents.slice(0, 5).map((talent) => (
                  <tr key={talent.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Avatar>
                            <AvatarImage src={talent.avatar} alt={talent.name} />
                            <AvatarFallback>{talent.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {talent.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{talent.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {Math.floor(Math.random() * 3) + 1} {/* Mock data - would be replaced with actual count */}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          talent.availability === "Available Now"
                            ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                            : talent.availability === "Limited Availability"
                            ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100"
                            : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
                        }`}
                      >
                        {talent.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;
