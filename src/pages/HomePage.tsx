import { LogOut, Calendar, Users, Settings, Star, PlusCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

// Helper function to format a date and time string
const formatDateTime = (date: any) => {
  if (!date) return "N/A";
  const d = new Date(date);
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return `${d.toLocaleDateString("en-US", dateOptions)} ${d.toLocaleTimeString("en-US", timeOptions)}`;
};

export default function HomePage({
  groups,
  meetups,
  favoriteGroupIds,
  setCurrentPage,
  navigateToGroupDetail,
  userId,
}: any) {
    const userRelevantGroups = groups.filter((group: any) =>
      group.user_id === userId || group.members?.some((member: any) => member.user_id === userId)
    );
    const sortedGroups = [...userRelevantGroups].sort((a, b) => {
        const aIsFavorite = favoriteGroupIds.includes(a.id);
        const bIsFavorite = favoriteGroupIds.includes(b.id);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return a.name.localeCompare(b.name);
    });

    const today = new Date();
    const todayMeetups = meetups.filter((meetup: any) => {
        const meetupDate = new Date(meetup.date_time);
        return meetupDate &&
               meetupDate.getFullYear() === today.getFullYear() &&
               meetupDate.getMonth() === today.getMonth() &&
               meetupDate.getDate() === today.getDate();
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">GREX</h1>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setCurrentPage('calendar')} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                        <Calendar size={22} />
                    </button>
                    <button onClick={() => alert('Settings page not implemented')} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                        <Settings size={22} />
                    </button>
                    <button onClick={handleLogout} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors">
                        <LogOut size={22} />
                    </button>
                </div>
            </header>

            <main className="p-8">
                {/* Welcome Banner */}
                <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">Welcome, User!</h2>
                        <p className="text-blue-200 mt-1">You have {todayMeetups.length} activity today. Stay productive!</p>
                    </div>
                    <Users size={60} className="text-blue-300 opacity-50"/>
                </div>

                {/* Groups Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">Your Groups</h3>
                        <div className="flex space-x-2">
                             <button onClick={() => setCurrentPage('joinGroup')} className="text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">Join Group</button>
                             <button onClick={() => setCurrentPage('createGroup')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"><PlusCircle size={16}/><span>Create Group</span></button>
                        </div>
                    </div>
                    {groups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedGroups.map(group => (
                                <div key={group.id} className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1" onClick={() => navigateToGroupDetail(group.id)}>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-blue-100 rounded-full">
                                                    <Users size={24} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-800">{group.name}</h4>
                                                    <p className="text-sm text-gray-500">{group.members?.length || 0} members</p>
                                                </div>
                                            </div>
                                            {favoriteGroupIds.includes(group.id) && (
                                                <Star className="text-yellow-400" size={20} fill="currentColor" />
                                            )}
                                        </div>
                                        <p className="text-gray-600 mt-4 text-sm">{group.description}</p>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-3 flex justify-end items-center">
                                        <a href="#" onClick={(e) => { e.stopPropagation(); navigateToGroupDetail(group.id); }} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                                            <span>View Details</span>
                                            <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-md">
                            <h4 className="text-xl font-semibold text-gray-700">No groups yet!</h4>
                            <p className="text-gray-500 mt-2">Why not create one and invite some friends?</p>
                        </div>
                    )}
                     <button onClick={() => setCurrentPage('allGroups')} className="w-full mt-6 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">View All Groups</button>
                </div>

                {/* Today's Activities Section */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Today's Activities</h3>
                    <div className="bg-white rounded-xl shadow-md">
                        <div className="p-6">
                            {todayMeetups.length > 0 ? (
                                <ul className="space-y-4">
                                    {todayMeetups.map((meetup: any) => (
                                        <li key={meetup.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-semibold text-gray-800">{meetup.title}</p>
                                                <p className="text-sm text-gray-500">in {groups.find((g: any) => g.id === meetup.group_id)?.name || 'N/A'}</p>
                                            </div>
                                            <span className="font-semibold text-blue-600">{formatDateTime(new Date(meetup.date_time))}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-12">
                                    <Calendar size={48} className="mx-auto text-gray-300"/>
                                    <h4 className="text-xl font-semibold text-gray-700 mt-4">All clear!</h4>
                                    <p className="text-gray-500 mt-2">No activities scheduled for today. Enjoy your free time!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
