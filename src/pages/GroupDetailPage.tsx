import { useState } from "react";
import { ChevronLeft, Star, Copy } from "lucide-react";

export default function GroupDetailPage({
  groups,
  setGroups,
  meetups,
  selectedGroupId,
  userId,
  setCurrentPage,
  navigateToAddActivity,
}: any) {
  const group = groups.find((g: any) => g.id === selectedGroupId);
  const [message, setMessage] = useState("");
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");

  const members = group?.members || [];
  const isMember = members.includes(userId);
  const isOwner = group?.owner === userId;

  const handleTogglePrivate = () => {
    if (!group) return;
    setGroups((prevGroups: any) =>
      prevGroups.map((g: any) =>
        g.id === group.id
          ? { ...g, isPublic: !g.isPublic }
          : g
      )
    );
    setMessage(
      `Group "${group.name}" is now ${group.isPublic ? "private" : "public"}.`
    );
    setTimeout(() => setMessage(""), 3000);
  };

  const upcomingMeetups = meetups.filter(
    (m: any) =>
      m.groupId === selectedGroupId && new Date(m.date) > new Date()
  );

  // This button now navigates to the new Add Activity Page
  const handleAddActivityClick = () => {
    navigateToAddActivity(selectedGroupId);
  };

  const handleAddToFavorites = () => {
    setMessage(`Group "${group.name}" added to favorites!`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(group.id);
    setMessage(`Copied group ID: ${group.id} to clipboard!`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleConfirmAddMember = () => {
    if (!group || !newMemberId) {
      setMessage("Please enter a valid member ID.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (group.members.includes(newMemberId)) {
      setMessage(`User ${newMemberId} is already a member.`);
      setTimeout(() => setMessage(""), 3000);
    } else {
      setGroups((prevGroups: any) =>
        prevGroups.map((g: any) =>
          g.id === group.id
            ? { ...g, members: [...g.members, newMemberId] }
            : g
        )
      );
      setMessage(`User ${newMemberId} has been added to the group.`);
      setNewMemberId("");
      setAddMemberModalOpen(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
        <div className="flex items-center mb-8 text-[#113F67] space-x-4">
          <button
            onClick={() => setCurrentPage("home")}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Group not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-800 font-sans">
      <div className="flex items-center mb-8 text-[#113F67] space-x-4">
        <button
          onClick={() => setCurrentPage("home")}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">{group.name}</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4 text-gray-600">
          <button
            onClick={handleAddToFavorites}
            className="flex items-center space-x-2 text-[#34699A] hover:text-[#113F67] transition-colors"
          >
            <span>Add to favourite</span>
            <Star size={20} className="stroke-current" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 bg-white rounded-xl shadow-md hover:bg-gray-100 transition-colors"
          >
            <Copy size={20} className="text-[#34699A]" />
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-[#34699A] text-white text-center py-3 rounded-xl mb-4 transition-opacity duration-300">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-[#34699A] text-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Activity</h2>
              {isMember && (
                <button
                  onClick={handleAddActivityClick}
                  className="bg-[#113F67] text-white px-4 py-2 rounded-xl shadow-lg hover:bg-green-500 transition-colors"
                >
                  Add
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 font-bold text-lg mb-4 pb-2 border-b border-[#113F67]">
              <span>Subject</span>
              <span>Time</span>
              <span>Description</span>
            </div>

            {upcomingMeetups.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetups.map((meetup: any) => (
                  <div
                    key={meetup.id}
                    className="grid grid-cols-3 text-md text-gray-200"
                  >
                    <span>{meetup.name}</span>
                    <span>{formatTime(new Date(meetup.date))}</span>
                    <span>{meetup.description || "N/A"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No upcoming activities.</p>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#113F67]">Member</h2>
            <div className="space-y-2 mb-6">
              {members.map((memberId: any, index: any) => (
                <p key={index} className="text-lg font-medium">
                  {memberId === userId ? "You" : memberId}
                </p>
              ))}
            </div>
            {isOwner && (
              <>
                <button
                  onClick={() => setAddMemberModalOpen(true)}
                  className="bg-[#34699A] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#113F67] transition-colors"
                >
                  Add member
                </button>
                <div className="flex items-center space-x-2 mt-4">
                  <span className="text-gray-700">turn on private group</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!group.isPublic}
                      onChange={handleTogglePrivate}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#34699A] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#113F67]"></div>
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-8 border w-96 shadow-lg rounded-xl bg-white">
            <h3 className="text-2xl font-bold mb-4 text-[#113F67]">Add Member</h3>
            <input
              type="text"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              className="w-full p-3 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34699A]"
              placeholder="Enter User ID"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setAddMemberModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl shadow-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddMember}
                className="bg-[#113F67] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#34699A] transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format a time string
const formatTime = (date: any) => {
  if (!date) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleTimeString("en-US", options);
};
