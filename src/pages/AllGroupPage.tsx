import { ChevronLeft, Users, Star, Search, PlusCircle } from "lucide-react";
import { useState, useMemo } from "react";

export default function AllGroupsPage({
  groups,
  setCurrentPage,
  navigateToGroupDetail,
  favoriteGroupIds = [],
  userId,
}: any) {
  const [searchTerm, setSearchTerm] = useState("");

  const userRelevantGroups = useMemo(() => {
    return groups.filter((group: any) =>
      group.user_id === userId || group.members?.some((member: any) => member.user_id === userId)
    );
  }, [groups, userId]); // Add userId to dependencies

  const filteredGroups = useMemo(() => {
    return userRelevantGroups.filter((group: any) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userRelevantGroups, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage("home")}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">All Groups</h1>
        </div>
        <div className="flex items-center space-x-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 bg-gray-100 text-gray-800 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>
            <button 
                onClick={() => setCurrentPage('createGroup')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <PlusCircle size={16}/>
                <span>Create Group</span>
            </button>
        </div>
      </header>

      <main className="p-8">
        {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGroups.map((group: any) => (
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
                        <p className="text-gray-600 mt-4 text-sm h-10 overflow-hidden">{group.description}</p>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end items-center">
                        <a href="#" onClick={(e) => { e.stopPropagation(); navigateToGroupDetail(group.id); }} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                            View Details
                        </a>
                    </div>
                </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-24">
                <Search size={64} className="mx-auto text-gray-300"/>
                <h3 className="text-2xl font-semibold text-gray-700 mt-6">No groups found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or create a new group!</p>
            </div>
        )}
      </main>
    </div>
  );
}