import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import ProfileCard from "@/components/profile/profile-card";
import TeamOverview from "@/components/profile/team-overview";
import { UserProfile } from "@/lib/types";
import { db, initializeFirebase, seedDemoData } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

const MyProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  
  const handleSeedData = async () => {
    try {
      setSeeding(true);
      const result = await seedDemoData();
      if (result) {
        alert("Demo data seeded successfully!");
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Initialize Firebase
        const { db } = initializeFirebase();
        
        if (db) {
          // In a real application, you would use authentication to get the current user's ID
          // For now, we're using a hardcoded ID for the demo
          const usersCollection = collection(db, "users");
          const profileRef = doc(usersCollection, "currentUser");
          const profileSnap = await getDoc(profileRef);
          
          if (profileSnap.exists()) {
            setProfile(profileSnap.data() as UserProfile);
          } else {
            // If profile doesn't exist yet, use default profile
            const defaultProfile = {
              id: "currentUser",
              name: "Jessica Thompson",
              role: "Creative Director & Talent Manager",
              bio: "Creative director with 8+ years of experience managing teams of designers, animators, and content creators. Passionate about connecting talented professionals with exciting projects and delivering exceptional results for clients.",
              avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
              email: "jessica@creativepulse.com",
              phone: "(555) 123-4567",
              location: "New York, NY",
              website: "www.creativepulse.com",
              skills: [
                "Project Management",
                "Team Leadership",
                "Client Relations",
                "Brand Strategy",
                "Content Direction",
                "Talent Acquisition"
              ]
            };
            setProfile(defaultProfile);
            
            // Create this profile in Firebase for future use
            try {
              await setDoc(doc(usersCollection, "currentUser"), defaultProfile);
              console.log("Default profile saved to Firebase");
            } catch (err) {
              console.error("Error creating default profile:", err);
            }
          }
        } else {
          // If Firebase is not available, use default profile
          setProfile({
            id: "currentUser",
            name: "Jessica Thompson",
            role: "Creative Director & Talent Manager",
            bio: "Creative director with 8+ years of experience managing teams of designers, animators, and content creators. Passionate about connecting talented professionals with exciting projects and delivering exceptional results for clients.",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
            email: "jessica@creativepulse.com",
            phone: "(555) 123-4567",
            location: "New York, NY",
            website: "www.creativepulse.com",
            skills: [
              "Project Management",
              "Team Leadership",
              "Client Relations",
              "Brand Strategy",
              "Content Direction",
              "Talent Acquisition"
            ]
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // If error, use default profile
        setProfile({
          id: "currentUser",
          name: "Jessica Thompson",
          role: "Creative Director & Talent Manager",
          bio: "Creative director with 8+ years of experience managing teams of designers, animators, and content creators. Passionate about connecting talented professionals with exciting projects and delivering exceptional results for clients.",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
          email: "jessica@creativepulse.com",
          phone: "(555) 123-4567",
          location: "New York, NY",
          website: "www.creativepulse.com",
          skills: [
            "Project Management",
            "Team Leadership",
            "Client Relations",
            "Brand Strategy",
            "Content Direction",
            "Talent Acquisition"
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 w-1/4 mb-4 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-2/4 mb-8 rounded"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile not found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            There was a problem loading your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile - CreativePulse</title>
        <meta name="description" content="Manage your personal profile and view your team's overview and availability." />
        <meta property="og:title" content="My Profile - CreativePulse" />
        <meta property="og:description" content="Access your profile information and manage your team of talented freelancers." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage your profile and view team statistics</p>
        </div>

        <ProfileCard profile={profile} />
        <TeamOverview />
        
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Data Management</h3>
          <Button 
            onClick={handleSeedData} 
            disabled={seeding}
            variant="outline"
            className="mr-2"
          >
            {seeding ? "Seeding Data..." : "Seed Demo Data"}
          </Button>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            This will populate your Firebase database with sample works, talents and projects for demo purposes.
          </p>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
