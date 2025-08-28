import { useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, getHours } from 'date-fns';

export default function CalendarView({
  groups,
  meetups,
  setCurrentPage,
  navigateToGroupDetail,
}: any) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const weekStartsOn = 1; // Monday
    const weekStart = startOfWeek(currentDate, { weekStartsOn });

    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const handlePrevWeek = () => {
        setCurrentDate(addDays(currentDate, -7));
    };

    const handleNextWeek = () => {
        setCurrentDate(addDays(currentDate, 7));
    };

    const getMeetupsForDay = (day: Date) => {
        return meetups.filter((meetup: any) => {
            const meetupDateTime = new Date(meetup.date_time);
            return isSameDay(meetupDateTime, day);
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setCurrentPage('home')} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                        <ChevronLeft size={22} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={handlePrevWeek} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-semibold text-gray-700 text-lg">{format(currentDate, 'MMMM yyyy')}</span>
                    <button onClick={handleNextWeek} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-grow p-8 flex flex-col">
                <div className="grid grid-cols-[auto,1fr] flex-grow">
                    <div>
                        <div className="h-16"></div>
                        {hours.map(hour => (
                            <div key={hour} className="h-16 flex justify-end pr-4">
                                <span className="text-sm text-gray-500 -translate-y-1/2">
                                    {format(new Date(0, 0, 0, hour), 'ha')}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 border-l border-gray-200 flex-grow">
                        {days.map(day => (
                            <div key={day.toString()} className="text-center py-4 border-b border-r border-gray-200">
                                <p className="text-sm text-gray-500">{format(day, 'EEE')}</p>
                                <p className={`text-2xl font-bold ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {format(day, 'd')}
                                </p>
                            </div>
                        ))}

                        <div className="col-span-7 grid grid-cols-7 grid-rows-24">
                        {
                            days.map(day => (
                                <div key={day.toISOString()} className="relative border-r border-gray-200 grid grid-rows-24">
                                    {hours.map(hour => (
                                        <div key={hour} className="h-16 border-b border-gray-200 relative">
                                            {getMeetupsForDay(day)
                                                .filter((meetup: any) => getHours(new Date(meetup.date_time)) === hour)
                                                .map((meetup: any) => {
                                                    const meetupDateTime = new Date(meetup.date_time);
                                                    const minutes = meetupDateTime.getMinutes();
                                                    const topOffset = (minutes / 60) * 4;
                                                    const group = groups.find((g: any) => g.id === meetup.group_id);
                                                    return (
                                                        <div
                                                            key={meetup.id}
                                                            onClick={() => navigateToGroupDetail(meetup.group_id)}
                                                            className="absolute w-full p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 shadow-md z-10 text-xs font-medium cursor-pointer transition-all"
                                                            style={{ top: `${topOffset}rem`, height: '2rem' }}
                                                        >
                                                            <p className="font-bold truncate">{meetup.title}</p>
                                                            {group && <p className="truncate">{group.name}</p>}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ))}
                                </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
