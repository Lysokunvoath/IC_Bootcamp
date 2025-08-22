import { LogOut, Calendar, Users, Settings, Star } from 'lucide-react';

// Helper function to format a time string
const formatTime = (date: any) => {
  if (!date) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleTimeString("en-US", options);
};

export default function HomePage({
  groups,
  meetups,
  favoriteGroupIds,
  setCurrentPage,
  navigateToGroupDetail,
}: any) {
    const sortedGroups = [...groups].sort((a, b) => {
        const aIsFavorite = favoriteGroupIds.includes(a.id);
        const bIsFavorite = favoriteGroupIds.includes(b.id);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return 0;
    });

    const today = new Date();
    const todayMeetups = meetups.filter((meetup: any) => {
        const meetupDate = new Date(meetup.date);
        return meetupDate &&
               meetupDate.getFullYear() === today.getFullYear() &&
               meetupDate.getMonth() === today.getMonth() &&
               meetupDate.getDate() === today.getDate();
    });

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
            <div className="flex justify-between items-center mb-8 text-[#113F67]">
                <h1 className="text-3xl font-bold">GREX</h1>
                <div className="flex space-x-4">
                    <button onClick={() => setCurrentPage('calendar')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <Calendar size={24} />
                    </button>
                    <button onClick={() => alert('Settings page not implemented')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <Settings size={24} />
                    </button>
                    <button onClick={() => alert('Logout action not implemented')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <LogOut size={24} />
                    </button>
                </div>
            </div>

            <div className="bg-[#113F67] text-white p-6 rounded-xl shadow-lg mb-8 flex items-center space-x-6">
                <div className="bg-white text-[#113F67] p-4 rounded-full">
                    <Users size={48} />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">Welcome, User</h2>
                    <p className="text-lg">You have {todayMeetups.length} activity today</p>
                </div>
            </div>

            <h3 className="text-2xl font-semibold mb-4">Your group :</h3>
            <div className="flex space-x-6 overflow-x-auto pb-4">
                <div className="flex-grow grid grid-flow-col auto-cols-[300px] md:auto-cols-[350px] lg:auto-cols-fr gap-6">
                    {sortedGroups.slice(0, 3).map(group => (
                        <div key={group.id} className="bg-[#34699A] text-white p-6 rounded-xl shadow-lg flex-shrink-0 cursor-pointer transition-transform hover:scale-105" onClick={() => navigateToGroupDetail(group.id)}>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-2 bg-[#113F67] rounded-full">
                                    <Users size={24} />
                                </div>
                                <h4 className="text-xl font-bold">{group.name}</h4>
                                {favoriteGroupIds.includes(group.id) && (
                                    <Star className="text-[#113F67]" size={24} fill="currentColor" />
                                )}
                            </div>
                            <p className="text-sm opacity-80 mb-4">{group.description}</p>
                            <div className="flex justify-end">
                                <button onClick={(e) => { e.stopPropagation(); navigateToGroupDetail(group.id); }} className="text-white bg-[#113F67] hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">View</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col space-y-4 flex-shrink-0 w-48">
                    <button onClick={() => setCurrentPage('joinGroup')} className="bg-[#113F67] text-white py-3 rounded-xl shadow-lg hover:bg-[#34699A] transition-colors">Join group</button>
                    <button onClick={() => setCurrentPage('createGroup')} className="bg-[#113F67] text-white py-3 rounded-xl shadow-lg hover:bg-[#34699A] transition-colors">Create group</button>
                    <button onClick={() => setCurrentPage('allGroups')} className="bg-[#113F67] text-white py-3 rounded-xl shadow-lg hover:bg-[#34699A] transition-colors">View all groups</button>
                </div>
            </div>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Your activity :</h3>
            <div className="bg-[#113F67] text-white p-6 rounded-xl shadow-lg">
                <div className="grid grid-cols-3 gap-4 font-bold text-lg mb-4 pb-2 border-b border-[#34699A]">
                    <span>Subject</span>
                    <span>Time</span>
                    <span>Group</span>
                </div>
                {todayMeetups.length > 0 ? (
                    <div className="space-y-4">
                        {todayMeetups.map((meetup: any) => (
                            <div key={meetup.id} className="grid grid-cols-3 text-md">
                                <span>{meetup.name}</span>
                                <span>{formatTime(new Date(meetup.date))}</span>
                                <span>{groups.find((g: any) => g.id === meetup.groupId)?.name || 'N/A'}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400">No activities scheduled for today.</p>
                )}
            </div>
        </div>
    );
}
