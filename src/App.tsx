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

  // Mock data for groups and meetups
  const [groups, setGroups] = useState([
    {
      id: "group_1",
      name: "Book Club",
      description: "Reading classic literature together.",
      members: ["user_123", "user_456"],
      owner: "user_123",
      isPublic: true,
    },
    {
      id: "group_2",
      name: "Coding Group",
      description: "Learning React and web development.",
      members: ["user_123", "user_789"],
      owner: "user_123",
      isPublic: true,
    },
    {
      id: "group_3",
      name: "Hiking Buddies",
      description: "Exploring local trails and nature.",
      members: ["user_123", "user_012"],
      owner: "user_456",
      isPublic: true,
    },
    {
      id: "group_4",
      name: "Gardening Enthusiasts",
      description: "Sharing tips on how to grow plants and flowers.",
      members: ["user_123", "user_012"],
      owner: "user_456",
      isPublic: true,
    },
    {
      id: "group_5",
      name: "Movie Buffs",
      description: "Discussing classic and new cinema releases.",
      members: ["user_123", "user_789"],
      owner: "user_123",
      isPublic: false,
    },
    {
      id: "group_6",
      name: "Photography Guild",
      description: "Sharing and critiquing photography work.",
      members: ["user_888", "user_999"],
      owner: "user_888",
      isPublic: true,
    },
    {
      id: "group_7",
      name: "Cooking Club",
      description: "Trying out new recipes and techniques together.",
      members: ["user_111", "user_222"],
      owner: "user_111",
      isPublic: true,
    },
    {
      id: "group_8",
      name: "Board Game Night",
      description: "Weekly gatherings for board games.",
      members: ["user_333", "user_444"],
      owner: "user_333",
      isPublic: false,
    },
  ]);

  const today = new Date();
  const meetupsInit = [
    {
      id: "meetup_1",
      name: "Read The Great Gatsby",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      groupId: "group_1",
    },
    {
      id: "meetup_2",
      name: "React Hooks Workshop",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
      groupId: "group_2",
    },
    {
      id: "meetup_3",
      name: "Morning Trail Hike",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 8, 0),
      groupId: "group_3",
    },
    {
      id: "meetup_4",
      name: "Evening Walk",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
      groupId: "group_3",
    },
  ];
  const [meetups, setMeetups] = useState(meetupsInit);

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
        return <CalendarView groups={groups} meetups={meetups} setCurrentPage={setCurrentPage} />;
      case "createGroup":
        return <CreateGroupPage setGroups={setGroups} setCurrentPage={setCurrentPage} userId={user?.id} />;
      case "allGroups":
        return (
          <AllGroupsPage
            groups={groups}
            favoriteGroupIds={favoriteGroupIds}
            setCurrentPage={setCurrentPage}
            navigateToGroupDetail={navigateToGroupDetail}
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
