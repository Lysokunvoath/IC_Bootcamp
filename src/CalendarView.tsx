import { useState, useEffect } from 'react';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, isSameMonth } from 'date-fns';

export default function CalendarView({ groups, meetups, setCurrentPage }) {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [selectedGroups, setSelectedGroups] = useState({});

    useEffect(() => {
        const initialSelected = groups.reduce((acc, group) => ({ ...acc, [group.id]: true }), {});
        setSelectedGroups(initialSelected);
    }, [groups]);

    const changeWeek = (direction) => {
        setCurrentWeekStart(prev => addDays(prev, direction * 7));
    };

    const toggleGroupSelection = (groupId) => {
        setSelectedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

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

            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
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
                    <div className="col-span-1"></div>
                    {days.map((day, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#34699A] text-white shadow-md">
                            <span className="text-lg font-semibold">{format(day, 'E')}</span>
                            <span className="text-2xl font-bold">{format(day, 'd')}</span>
                        </div>
                    ))}

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
}
