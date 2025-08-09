import { useState, useEffect } from 'react';
import { Home, LogOut, Calendar, Plus, Users, Settings, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { format, startOfWeek, addDays, getDay, isSameDay, isSameMonth } from 'date-fns';

// This is a self-contained application with both the Home and Calendar pages.
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

    // State to manage which page is currently displayed
    const [currentPage, setCurrentPage] = useState('home');

    // Mock data for groups and meetups, centralized for both pages
    const [groups] = useState([
        { id: 'group_1', name: 'Book Club', description: 'Reading classic literature together.', members: ['user_123', 'user_456'], owner: 'user_123' },
        { id: 'group_2', name: 'Coding Group', description: 'Learning React and web development.', members: ['user_123', 'user_789'], owner: 'user_123' },
        { id: 'group_3', name: 'Hiking Buddies', description: 'Exploring local trails and nature.', members: ['user_123', 'user_012'], owner: 'user_456' },
    ]);

    const [meetups] = useState([
        { id: 'meetup_1', name: 'Read The Great Gatsby', date: new Date().setHours(10, 0, 0), groupId: 'group_1' },
        { id: 'meetup_2', name: 'React Hooks Workshop', date: new Date().setHours(14, 30, 0), groupId: 'group_2' },
        { id: 'meetup_3', name: 'Morning Trail Hike', date: new Date().setDate(new Date().getDate() + 1), groupId: 'group_3' },
        { id: 'meetup_4', name: 'Evening Walk', date: new Date().setHours(18, 0, 0), groupId: 'group_3' },
    ]);
    
    const [favoriteGroupIds] = useState(['group_1']);

    // --- Homepage Component ---
    const HomePage = () => {
        // Sort groups to show favorites first
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

        // Mock functions for navigation
        const mockNavigate = (page) => {
            // In a real app, this would handle routing
            console.log(`Navigating to ${page} page...`);
        };
    
        return (
            <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 text-[#113F67]">
                    <h1 className="text-3xl font-bold">GREX</h1>
                    <div className="flex space-x-4">
                        <button onClick={() => setCurrentPage('calendar')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
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
                                    <span>{formatTime(new Date(meetup.date))}</span>
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
    };

    // --- Calendar View Component ---
    const CalendarView = () => {
        // State for the calendar
        const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
        const [selectedGroups, setSelectedGroups] = useState({});

        // Initialize selected groups on component mount
        useEffect(() => {
            const initialSelected = groups.reduce((acc, group) => ({ ...acc, [group.id]: true }), {});
            setSelectedGroups(initialSelected);
        }, [groups]);

        // Function to change the week displayed
        const changeWeek = (direction) => {
            setCurrentWeekStart(prev => addDays(prev, direction * 7));
        };

        // Function to toggle group visibility in the calendar
        const toggleGroupSelection = (groupId) => {
            setSelectedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
        };

        // Prepare data for rendering the calendar
        const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
        const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

        // Filter meetups for the current week and selected groups
        const meetupsInWeek = meetups.filter(meetup => {
            const meetupDate = new Date(meetup.date);
            return selectedGroups[meetup.groupId] &&
                   meetupDate &&
                   isSameMonth(meetupDate, currentWeekStart) &&
                   meetupDate >= currentWeekStart &&
                   meetupDate < addDays(currentWeekStart, 7);
        });

        return (
            <div className="flex min-h-screen bg-white text-gray-900 font-sans">
                {/* Sidebar */}
                <div className="w-72 bg-[#113F67] text-white p-6 flex-shrink-0">
                    <h1 className="text-3xl font-bold mb-8">
                        {format(currentWeekStart, 'MMM')}
                        <br />
                        {format(currentWeekStart, 'do')}
                    </h1>
                    <div className="space-y-4">
                        {groups.map(group => (
                            <div key={group.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedGroups[group.id] || false}
                                    onChange={() => toggleGroupSelection(group.id)}
                                    className="w-5 h-5 text-[#34699A] bg-white border-gray-300 rounded focus:ring-[#34699A] cursor-pointer"
                                />
                                <span className="text-white text-lg">{group.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Calendar View */}
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-8">
                        {/* Back button for navigation */}
                        <button onClick={() => setCurrentPage('home')} className="p-2 mr-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                            <Home size={24} />
                        </button>
                        <h1 className="text-3xl font-bold">Calendar</h1>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => changeWeek(-1)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={() => changeWeek(1)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-8 gap-1">
                        {/* Day headers */}
                        <div className="col-span-1"></div>
                        {days.map((day, index) => (
                            <div key={index} className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#34699A] text-white shadow-md">
                                <span className="text-lg font-semibold">{format(day, 'E')}</span>
                                <span className="text-2xl font-bold">{format(day, 'd')}</span>
                            </div>
                        ))}

                        {/* Time slots and meetups */}
                        {hours.map(hour => (
                            <>
                                <div className="col-span-1 text-sm font-semibold text-gray-600 flex items-start pt-2">
                                    {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'am' : 'pm'}
                                </div>
                                {days.map((day, dayIndex) => (
                                    <div key={`${dayIndex}-${hour}`} className="col-span-1 border-t border-gray-200 relative min-h-[50px] overflow-hidden">
                                        {meetupsInWeek.map(meetup => {
                                            const meetupDate = new Date(meetup.date);
                                            const meetupHour = meetupDate.getHours();
                                            if (isSameDay(meetupDate, day) && meetupHour === hour) {
                                                const group = groups.find(g => g.id === meetup.groupId) || {};
                                                return (
                                                    <div
                                                        key={meetup.id}
                                                        className="absolute top-0 left-0 right-0 p-2 m-1 rounded-lg text-white bg-[#113F67] shadow-md z-10 text-xs font-medium"
                                                        style={{ height: 'calc(50px * 1)' }}
                                                    >
                                                        <p className="font-bold truncate">{group.name}</p>
                                                        <p className="truncate">{meetup.name}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                ))}
                            </>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // --- Main App Logic & Routing ---
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'calendar':
                return <CalendarView />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="font-sans antialiased text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {renderPage()}
        </div>
    );
}
