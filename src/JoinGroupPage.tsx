import { useState } from 'react';
import { ChevronLeft, Search, UserPlus, Copy, ChevronRight } from 'lucide-react';

export default function JoinGroupPage({ groups, setGroups, userId, setCurrentPage }) {
    console.log('JoinGroupPage props:', { groups, setGroups, userId, setCurrentPage });
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    const publicGroups = groups.filter(group => group.isPublic);

    const filteredGroups = publicGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleJoinGroup = (groupId) => {
        const groupToJoin = groups.find(g => g.id === groupId);

        if (groupToJoin && !groupToJoin.members.includes(userId)) {
            setGroups(prevGroups => prevGroups.map(group =>
                group.id === groupId
                    ? { ...group, members: [...group.members, userId] }
                    : group
            ));
            setMessage(`Successfully joined "${groupToJoin.name}"!`);
            setTimeout(() => setMessage(''), 3000);
        } else if (groupToJoin.members.includes(userId)) {
            setMessage(`You are already a member of "${groupToJoin.name}".`);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleCopyGroupId = (groupId) => {
        // Mock clipboard copy
        navigator.clipboard.writeText(groupId);
        setMessage(`Copied group ID: ${groupId} to clipboard!`);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
            <div className="flex items-center mb-8 text-[#113F67] space-x-4">
                <button onClick={() => setCurrentPage('home')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold">Join group</h1>
            </div>

            <div className="bg-[#113F67] text-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Public group</h2>
                    <div className="relative">
                        <input
                            type="text"
                            className="bg-[#34699A] text-white rounded-xl py-2 pl-4 pr-10 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34699A] transition-colors"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white" size={20} />
                    </div>
                </div>
                
                {message && (
                    <div className="bg-[#34699A] text-white text-center py-3 rounded-xl mb-4 transition-opacity duration-300">
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map(group => (
                            <div key={group.id} className="bg-[#34699A] text-white p-4 rounded-xl shadow-md flex justify-between items-center">
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <span className="font-bold">{group.name}</span>
                                    <span className="text-sm opacity-80">Members: {group.members.length}</span>
                                    <span className="text-sm opacity-80">{group.isPublic ? 'Public' : 'Private'}</span>
                                </div>
                                <div className="flex space-x-2 items-center">
                                    {!group.members.includes(userId) && (
                                        <button 
                                            onClick={() => handleJoinGroup(group.id)} 
                                            className="p-2 bg-[#113F67] rounded-full hover:bg-green-500 transition-colors"
                                            title="Join Group"
                                        >
                                            <UserPlus size={20} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleCopyGroupId(group.id)} 
                                        className="p-2 bg-[#113F67] rounded-full hover:bg-gray-500 transition-colors"
                                        title="Copy Group ID"
                                    >
                                        <Copy size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400">No public groups found.</p>
                    )}
                </div>
                
                <div className="flex justify-center items-center mt-6 text-gray-300">
                    <button className="p-2 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <span className="px-4">Page 1/2</span>
                    <button className="p-2 hover:text-white transition-colors">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
