import { useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { ChevronLeft, Search, UserPlus, CheckCircle, Copy } from "lucide-react";

export default function JoinGroupPage({
  groups,
  setGroups,
  userId,
  setCurrentPage,
}: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [joinedGroupIds, setJoinedGroupIds] = useState(new Set());

  const publicGroups = useMemo(() => {
    return groups.filter((group: any) => group.isPublic);
  }, [groups]);

  const filteredGroups = useMemo(() => {
    return publicGroups.filter((group: any) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [publicGroups, searchTerm]);

  const handleJoinGroup = async (groupId: any) => {
    const groupToJoin = groups.find((g: any) => g.id === groupId);
    if (!groupToJoin) return;

    setMessage({ text: "", type: "" });

    try {
      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: userId,
      });

      if (error) {
        if (error.code === '23505') {
          setMessage({ text: `You are already a member of "${groupToJoin.name}".`, type: "info" });
        } else {
          throw error;
        }
      } else {
        setGroups((prevGroups: any) =>
          prevGroups.map((group: any) =>
            group.id === groupId
              ? { ...group, members: [...(group.members || []), userId] }
              : group
          )
        );
        setJoinedGroupIds(prev => new Set(prev).add(groupId));
        setMessage({ text: `Successfully joined "${groupToJoin.name}"!`, type: "success" });
      }
    } catch (error: any) {
      console.error("Error joining group:", error);
      setMessage({ text: `Failed to join "${groupToJoin.name}": ${error.message}`, type: "error" });
    } finally {
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    }
  };

  const handleCopyGroupId = (groupId: any) => {
    navigator.clipboard.writeText(groupId);
    setMessage({ text: `Group ID copied to clipboard!`, type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
            <button
                onClick={() => setCurrentPage("home")}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            >
                <ChevronLeft size={22} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-4">Join a Group</h1>
        </header>

        <main className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search for public groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-300 text-gray-800 py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                {message.text && (
                    <div className={`p-3 rounded-lg text-center font-medium mb-6 transition-all duration-300 ${
                        message.type === 'success' ? "bg-green-100 text-green-700" : 
                        message.type === 'error' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    }`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group: any) => {
                                const isMember = group.members.includes(userId) || joinedGroupIds.has(group.id);
                                return (
                                    <li key={group.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition-colors">
                                        <div className="mb-4 md:mb-0">
                                            <h3 className="text-lg font-bold text-gray-800">{group.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                                            <p className="text-sm text-gray-500 mt-2 font-medium">{group.members.length} members</p>
                                        </div>
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleCopyGroupId(group.id)}
                                                className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                                title="Copy Group ID"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleJoinGroup(group.id)}
                                                disabled={isMember}
                                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center space-x-2 ${
                                                    isMember 
                                                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                            >
                                                {isMember ? <CheckCircle size={18}/> : <UserPlus size={18} />}
                                                <span>{isMember ? "Joined" : "Join"}</span>
                                            </button>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="text-center p-12">
                                <Search size={48} className="mx-auto text-gray-300"/>
                                <h4 className="text-xl font-semibold text-gray-700 mt-4">No Public Groups Found</h4>
                                <p className="text-gray-500 mt-2">Try a different search term or check back later.</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </main>
    </div>
  );
}