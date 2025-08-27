import { useState } from "react";
import { ChevronLeft, Info } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function CreateGroupPage({
  setGroups,
  setCurrentPage,
  userId,
}: any) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: groupName,
          description: description,
          is_public: isPublic,
          user_id: userId,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      if (groupData) {
        const { error: memberError } = await supabase
          .from("group_members")
          .insert({ group_id: groupData.id, user_id: userId });

        if (memberError) throw memberError;
        
        // This part for local state update can be removed if you fetch groups from DB in App.tsx
        const newGroup = {
            id: groupData.id,
            name: groupName,
            description: description,
            isPublic: isPublic,
            user_id: userId,
            members: [userId],
        };
        setGroups((prevGroups: any) => [...prevGroups, newGroup]);
      }

      setCurrentPage("home");

    } catch (error: any) {
      setError(error.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-sm p-4 flex items-center">
            <button
                onClick={() => setCurrentPage("home")}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            >
                <ChevronLeft size={22} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-4">Create a New Group</h1>
        </header>

        <main className="p-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
                <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                        <input
                            id="groupName"
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="e.g., Weekend Hikers"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
                            placeholder="What is this group about?"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Group Privacy</label>
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                            <div>
                                <p className="font-semibold text-gray-800">{isPublic ? "Public Group" : "Private Group"}</p>
                                <p className="text-sm text-gray-500">{isPublic ? "Anyone can find and join this group." : "Only invited members can find and join."}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg flex items-center space-x-2">
                            <Info size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating..." : "Create Group"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
  );
}
