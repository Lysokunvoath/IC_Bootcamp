import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function AddActivityPage({ selectedGroupId, meetups, setMeetups, setCurrentPage }) {
    const [subject, setSubject] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleAddActivity = (e) => {
        e.preventDefault();
        // Create a new meetup object
        const newMeetup = {
            id: `meetup_${meetups.length + 1}`,
            name: subject,
            date: new Date().setHours(parseInt(time.split(':')[0], 10), parseInt(time.split(':')[1], 10)),
            groupId: selectedGroupId,
            description: description
        };
        // Add the new meetup to the meetups state
        setMeetups(prevMeetups => [...prevMeetups, newMeetup]);
        // Display a success message
        setMessage("Activity added successfully!");
        // Navigate back to the Group Detail page after a short delay
        setTimeout(() => {
            setMessage('');
            setCurrentPage('groupDetail');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
            {/* Header */}
            <div className="flex items-center mb-8 text-[#113F67] space-x-4">
                <button onClick={() => setCurrentPage('groupDetail')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold">Add activities</h1>
            </div>

            {/* Message Box */}
            {message && (
                <div className="bg-[#34699A] text-white text-center py-3 rounded-xl mb-4 transition-opacity duration-300">
                    {message}
                </div>
            )}
            
            <form onSubmit={handleAddActivity} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Input */}
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="md:col-span-2 shadow appearance-none border-none rounded-xl w-full py-4 px-6 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#34699A] bg-[#34699A] placeholder-white"
                    placeholder="Subject..."
                    required
                />
                
                {/* Set time input */}
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="shadow appearance-none border-none rounded-xl w-full py-4 px-6 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#34699A] bg-[#34699A] placeholder-white"
                    placeholder="Set time"
                    required
                />
                
                {/* Description Textarea */}
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border-none rounded-xl w-full py-4 px-6 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#34699A] h-32 resize-none bg-[#34699A] placeholder-white"
                    placeholder="Description..."
                ></textarea>
                
                {/* Confirm Button */}
                <button
                    type="submit"
                    className="mt-4 md:col-span-1 bg-[#113F67] hover:bg-[#34699A] text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#113F67] transition-colors"
                >
                    Confirm
                </button>
            </form>
        </div>
    );
}
