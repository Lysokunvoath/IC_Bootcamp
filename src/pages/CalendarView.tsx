import React from "react";
import { ChevronLeft } from 'lucide-react';
import { isSameDay } from 'date-fns';

export default function CalendarView({
  groups,
  meetups,
  setCurrentPage,
}: any) {
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const meetupsInWeek = meetups.filter((meetup: any) => {
        const meetupDate = new Date(meetup.date);
        return meetupDate >= days[0] && meetupDate <= days[days.length - 1];
    });

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
            <div className="flex items-center mb-8 text-[#113F67] space-x-4">
                <button onClick={() => setCurrentPage('home')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold">Calendar (Not Implemented)</h1>
            </div>
            <div className="bg-[#113F67] text-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto text-center">
                <p>This is a placeholder for the Calendar View.</p>
                <p>Implement your calendar UI here.</p>
            </div>
            <div className="grid grid-cols-8 gap-4 mt-8">
                <div className="col-span-1"></div>
                {days.map(day => (
                    <div key={day.toString()} className="col-span-1 text-sm font-semibold text-gray-600">
                        {day.toLocaleDateString('default', { weekday: 'short' })}
                    </div>
                ))}
                {hours.map(hour => (
                    <React.Fragment key={hour}>
                        <div className="col-span-1 text-sm font-semibold text-gray-600 flex items-start pt-2">
                            {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'am' : 'pm'}
                        </div>
                        {days.map((day, dayIndex) => (
                            <div key={`${dayIndex}-${hour}`} className="col-span-1 border-t border-gray-200 relative min-h-[50px] overflow-hidden">
                                {meetupsInWeek.map((meetup: any) => {
                                    const meetupDate = new Date(meetup.date);
                                    const meetupHour = meetupDate.getHours();
                                    if (isSameDay(meetupDate, day) && meetupHour === hour) {
                                        const group = groups.find((g: any) => g.id === meetup.groupId) || {};
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
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
