import { ChevronLeft, Users, Star } from 'lucide-react';

export default function AllGroupsPage({ groups, favoriteGroupIds, setCurrentPage, navigateToGroupDetail }) {
    return (
        <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
            <div className="flex items-center justify-between mb-8 text-[#113F67]">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setCurrentPage('home')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold">All Groups</h1>
                </div>
                <button onClick={() => setCurrentPage('createGroup')} className="bg-[#113F67] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#34699A] transition-colors">
                    Create new group
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                    <div key={group.id} className="bg-[#34699A] text-white p-6 rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105" onClick={() => navigateToGroupDetail(group.id)}>
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
        </div>
    );
}
