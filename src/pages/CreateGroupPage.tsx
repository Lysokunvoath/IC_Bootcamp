import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function CreateGroupPage({
  setGroups,
  setCurrentPage,
  userId,
}: any) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [tag, setTag] = useState("");
  const [invite, setInvite] = useState("");

  const handleCreate = (e: any) => {
    e.preventDefault();
    const newGroup = {
      id: `group_${Math.random().toString(36).substr(2, 9)}`,
      name: groupName,
      description: description,
      isPrivate: isPrivate,
      members: [userId],
      owner: userId,
      isPublic: !isPrivate,
    };
    setGroups((prevGroups: any) => [...prevGroups, newGroup]);
    setCurrentPage("home");
  };

  const handleAddTag = () => {
    if (tag.trim()) {
      setTag("");
    }
  };

  const handleAddInvite = () => {
    if (invite.trim()) {
      setInvite("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
      <div className="flex items-center mb-8 text-[#113F67] space-x-4">
        <button
          onClick={() => setCurrentPage("home")}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">Create group</h1>
      </div>

      <form onSubmit={handleCreate} className="max-w-4xl mx-auto">
        <div className="mb-6">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="shadow appearance-none border-none rounded-xl w-full py-4 px-6 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#34699A] bg-[#34699A] placeholder-white"
            placeholder="Enter group name..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-6">
            <div className="flex space-x-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="shadow appearance-none border-none rounded-xl w-full py-4 px-6 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#34699A] bg-[#34699A] placeholder-white"
                placeholder="Tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-[#113F67] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#34699A] transition-colors"
              >
                Add
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border-none rounded-xl w-full py-4 px-6 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#34699A] h-32 resize-none bg-[#34699A] placeholder-white"
              placeholder="Description"
              required
            ></textarea>
          </div>

          <div className="relative">
            <textarea
              value={invite}
              onChange={(e) => setInvite(e.target.value)}
              className="shadow appearance-none border-none rounded-xl w-full py-4 px-6 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#34699A] h-full resize-none bg-[#34699A] placeholder-white"
              placeholder="Invite..."
            ></textarea>
            <button
              type="button"
              onClick={handleAddInvite}
              className="absolute bottom-4 right-4 bg-[#113F67] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#34699A] transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            type="submit"
            className="bg-[#113F67] hover:bg-[#34699A] text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#113F67] transition-colors"
          >
            Confirm
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">turn on private group</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#34699A] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#113F67]"></div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
