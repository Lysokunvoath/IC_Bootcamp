import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import CalendarView from "./pages/CalendarView";
import CreateGroupPage from "./pages/CreateGroupPage";
import AllGroupsPage from "./pages/AllGroupPage";
import JoinGroupPage from "./pages/JoinGroupPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import AddActivityPage from "./pages/AddActivityPage";
import LandingPage from "./pages/LandingPage";
import { supabase } from "./supabaseClient";

// Main App component responsible for state management and routing
export default function App() {
  // Track Supabase user
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // State to manage which page is currently displayed
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [favoriteGroupIds] = useState(["group_1"]);

  const [groups, setGroups] = useState<any[]>([]);
  const [meetups, setMeetups] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const fetchGroups = async () => {
        const { data, error } = await supabase.from("groups").select("*, members:group_members(user_id)");
        if (error) console.error("Error fetching groups:", error);
        else {
          // Map is_public to isPublic for frontend consistency
          const mappedData = data.map((group: any) => ({
            ...group,
            isPublic: group.is_public, // Map snake_case from DB to camelCase for frontend
          }));
          setGroups(mappedData);
        }
      };

      const fetchMeetups = async () => {
        // First, get the group IDs the user is a member of
        const { data: memberGroups, error: memberError } = await supabase
          .from("group_members")
          .select("group_id")
          .eq("user_id", user.id);

        if (memberError) {
          console.error("Error fetching user's group memberships:", memberError);
          return;
        }

        const groupIds = memberGroups.map((mg: any) => mg.group_id);

        // Then, fetch meetups only for those groups
        const { data, error } = await supabase
          .from("meetups")
          .select("*")
          .in("group_id", groupIds); // Use .in() to filter by multiple group IDs

        if (error) console.error("Error fetching meetups:", error);
        else setMeetups(data);
      };

      fetchGroups();
      fetchMeetups();
    }
  }, [user]);

  // Navigation functions
  const navigateToGroupDetail = (groupId: any) => {
    setSelectedGroupId(groupId);
    setCurrentPage("groupDetail");
  };

  const navigateToAddActivity = (groupId: any) => {
    setSelectedGroupId(groupId);
    setCurrentPage("addActivity");
  };

  // Main routing logic
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            groups={groups}
            meetups={meetups}
            favoriteGroupIds={favoriteGroupIds}
            setCurrentPage={setCurrentPage}
            navigateToGroupDetail={navigateToGroupDetail}
            userId={user?.id}
          />
        );
      case "calendar":
        return <CalendarView groups={groups} meetups={meetups} setCurrentPage={setCurrentPage} navigateToGroupDetail={navigateToGroupDetail} />;
      case "createGroup":
        return <CreateGroupPage setGroups={setGroups} setCurrentPage={setCurrentPage} userId={user?.id} />;
      case "allGroups":
        return (
          <AllGroupsPage
            groups={groups}
            favoriteGroupIds={favoriteGroupIds}
            setCurrentPage={setCurrentPage}
            navigateToGroupDetail={navigateToGroupDetail}
            userId={user?.id}
          />
        );
      case "joinGroup":
        return <JoinGroupPage groups={groups} setGroups={setGroups} userId={user?.id} setCurrentPage={setCurrentPage} />;
      case "groupDetail":
        return (
          <GroupDetailPage
            groups={groups}
            setGroups={setGroups}
            meetups={meetups}
            selectedGroupId={selectedGroupId}
            userId={user?.id}
            setCurrentPage={setCurrentPage}
            navigateToAddActivity={navigateToAddActivity}
          />
        );
      case "addActivity":
        return (
          <AddActivityPage
            selectedGroupId={selectedGroupId}
            meetups={meetups}
            setMeetups={setMeetups}
            setCurrentPage={setCurrentPage}
            userId={user?.id}
          />
        );
      default:
        return (
          <HomePage
            groups={groups}
            meetups={meetups}
            favoriteGroupIds={favoriteGroupIds}
            setCurrentPage={setCurrentPage}
            navigateToGroupDetail={navigateToGroupDetail}
            userId={user?.id}
          />
        );
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="font-sans antialiased text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div>{!user ? <LandingPage /> : renderPage()}</div>
    </div>
  );
}
