import { useState } from 'react';
import { Home, LogOut, Calendar, Plus, Users, Settings, Search, Copy, Star } from 'lucide-react';
import { format } from 'date-fns';

// This is a simplified version of the app focusing on the homepage.
// All Firebase logic, routing, and other pages have been removed.
// Mock data is used to simulate a user's groups and activities.

// Helper function to format a time string
const formatTime = (date) => {
    if (!date) return 'N/A';
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(date).toLocaleTimeString('en-US', options);
};

export default function App() {
    // Mock user ID and data for a single user
    const userId = 'user_123';

    // Mock data for groups and meetups
    const [groups, setGroups] = useState([
        { id: 'group_1', name: 'Book Club', description: 'Reading classic literature together.', members: ['user_123', 'user_456'], owner: 'user_123' },
        { id: 'group_2', name: 'Coding Group', description: 'Learning React and web development.', members: ['user_123', 'user_789'], owner: 'user_123' },
        { id: 'group_3', name: 'Hiking Buddies', description: 'Exploring local trails and nature.', members: ['user_123', 'user_012'], owner: 'user_456' },
    ]);

    const [meetups, setMeetups] = useState([
        { id: 'meetup_1', name: 'Read The Great Gatsby', date: new Date().setHours(10, 0, 0), groupId: 'group_1' },
        { id: 'meetup_2', name: 'React Hooks Workshop', date: new Date().setHours(14, 30, 0), groupId: 'group_2' },
        { id: 'meetup_3', name: 'Morning Trail Hike', date: new Date().setDate(new Date().getDate() + 1), groupId: 'group_3' },
    ]);
    
    const [favoriteGroupIds, setFavoriteGroupIds] = useState(['group_1']);
    
    // Simulating user-specific logic
    const sortedGroups = [...groups].sort((a, b) => {
        const aIsFavorite = favoriteGroupIds.includes(a.id);
        const bIsFavorite = favoriteGroupIds.includes(b.id);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return 0;
    });

    const today = new Date();
    const todayMeetups = meetups.filter(meetup => {
        const meetupDate = new Date(meetup.date);
        return meetupDate &&
               meetupDate.getFullYear() === today.getFullYear() &&
               meetupDate.getMonth() === today.getMonth() &&
               meetupDate.getDate() === today.getDate();
    });

    // Mock functions for navigation that would lead to other pages
    const mockNavigate = (page) => {
        alert(`Navigating to ${page} page...`);
        // In a real app, this would change the `currentPage` state
    };
    
    return (
        <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 text-[#113F67]">
                <h1 className="text-3xl font-bold">GREX</h1>
                <div className="flex space-x-4">
                    <button onClick={() => mockNavigate('calendar')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <Calendar size={24} />
                    </button>
                    <button onClick={() => mockNavigate('settings')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <Settings size={24} />
                    </button>
                    <button onClick={() => mockNavigate('logout')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <LogOut size={24} />
                    </button>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="bg-[#113F67] text-white p-6 rounded-xl shadow-lg mb-8 flex items-center space-x-6">
                <div className="bg-white text-[#113F67] p-4 rounded-full">
                    <Users size={48} />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">Welcome, User</h2>
                    <p className="text-lg">You have {todayMeetups.length} activity today</p>
                </div>
            </div>

            {/* Your Groups Section */}
            <h3 className="text-2xl font-semibold mb-4">Your group :</h3>
            <div className="flex space-x-6 overflow-x-auto pb-4">
                <div className="flex-grow grid grid-flow-col auto-cols-[300px] md:auto-cols-[350px] lg:auto-cols-fr gap-6">
                    {sortedGroups.slice(0, 3).map(group => (
                        <div key={group.id} className="bg-[#34699A] text-white p-6 rounded-xl shadow-lg flex-shrink-0 cursor-pointer transition-transform hover:scale-105" onClick={() => mockNavigate('viewGroup')}>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-2 bg-[#113F67] rounded-full">
                                    <Users size={24} />
                                </div>
                                <h4 className="text-xl font-bold">{group.name}</h4>
                            </div>
                            <p className="text-sm opacity-80 mb-4">{group.description}</p>
                            <div className="flex justify-end">
                                <button className="text-white bg-[#113F67] hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">View</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col space-y-4 flex-shrink-0 w-48">
                    <button onClick={() => mockNavigate('joinGroup')} className="bg-[#113F67] text-white py-3 rounded-xl shadow-lg hover:bg-[#34699A] transition-colors">Join group</button>
                    <button onClick={() => mockNavigate('createGroup')} className="bg-[#113F67] text-white py-3 rounded-xl shadow-lg hover:bg-[#34699A] transition-colors">Create group</button>
                </div>
            </div>

            {/* Your Activity Section */}
            <h3 className="text-2xl font-semibold mt-8 mb-4">Your activity :</h3>
            <div className="bg-[#113F67] text-white p-6 rounded-xl shadow-lg">
                <div className="grid grid-cols-3 gap-4 font-bold text-lg mb-4 pb-2 border-b border-[#34699A]">
                    <span>Subject</span>
                    <span>Time</span>
                    <span>Group</span>
                </div>
                {todayMeetups.length > 0 ? (
                    <div className="space-y-4">
                        {todayMeetups.map(meetup => (
                            <div key={meetup.id} className="grid grid-cols-3 text-md">
                                <span>{meetup.name}</span>
                                <span>{formatTime(meetup.date)}</span>
                                <span>{groups.find(g => g.id === meetup.groupId)?.name || 'N/A'}</span>
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
