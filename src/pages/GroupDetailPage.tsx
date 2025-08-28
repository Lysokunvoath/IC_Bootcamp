import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { ChevronLeft, Star, Copy, PlusCircle, Settings, Trash2, LogOut, User, Shield } from "lucide-react";

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
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [newMemberId, setNewMemberId] = useState("");
  const [activeTab, setActiveTab] = useState('activities');

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (selectedGroupId) {
        const { data, error } = await supabase
          .from("group_members")
          .select("user_id")
          .eq("group_id", selectedGroupId);

        if (error) {
          console.error("Error fetching group members:", error);
        } else {
          setGroupMembers(data.map((member: any) => member.user_id));
        }
      }
    };
    fetchGroupMembers();
  }, [selectedGroupId]);

  const isMember = groupMembers.includes(userId);
  const isOwner = group?.user_id === userId;

  const handleTogglePrivate = async () => {
    if (!group) return;
    const newIsPublic = !group.isPublic;
    try {
      const { error } = await supabase.from("groups").update({ is_public: newIsPublic }).eq("id", group.id);
      if (error) throw error;
      setGroups((prevGroups: any) => prevGroups.map((g: any) => g.id === group.id ? { ...g, isPublic: newIsPublic } : g));
      setMessage({ text: `Group is now ${newIsPublic ? "public" : "private"}.`, type: "success" });
    } catch (error: any) {
      setMessage({ text: `Failed to change privacy: ${error.message}`, type: "error" });
    } finally {
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const upcomingMeetups = meetups.filter((m: any) => m.group_id === selectedGroupId && new Date(m.date_time) > new Date());

  const handleCopy = () => {
    navigator.clipboard.writeText(group.id);
    setMessage({ text: "Group ID copied to clipboard!", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleConfirmAddMember = async () => {
    if (!group || !newMemberId) {
      setMessage({ text: "Please enter a valid member ID.", type: "error" });
      return;
    }
    try {
      const { error } = await supabase.from("group_members").insert({ group_id: group.id, user_id: newMemberId });
      if (error) {
        if (error.code === '23505') setMessage({ text: `User is already a member.`, type: "info" });
        else throw error;
      } else {
        setGroupMembers(prev => [...prev, newMemberId]);
        setMessage({ text: `User ${newMemberId} has been added.`, type: "success" });
        setNewMemberId("");
        setAddMemberModalOpen(false);
      }
    } catch (error: any) {
      setMessage({ text: `Failed to add member: ${error.message}`, type: "error" });
    }
  };

  const handleLeaveGroup = async () => {
    if (!group || !window.confirm(`Are you sure you want to leave "${group.name}"?`)) return;
    try {
      const { error } = await supabase.from("group_members").delete().match({ group_id: group.id, user_id: userId });
      if (error) throw error;
      setCurrentPage("home");
    } catch (error: any) {
      setMessage({ text: `Failed to leave group: ${error.message}`, type: "error" });
    }
  };

  const handleDeleteGroup = async () => {
    if (!group || !window.confirm(`Are you sure you want to delete "${group.name}"? This is irreversible.`)) return;
    try {
      await supabase.from("group_members").delete().eq("group_id", group.id);
      await supabase.from("groups").delete().eq("id", group.id);
      setGroups((prevGroups: any) => prevGroups.filter((g: any) => g.id !== group.id));
      setCurrentPage("home");
    } catch (error: any) {
      setMessage({ text: `Failed to delete group: ${error.message}`, type: "error" });
    }
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-700">Group not found</h1>
            <button onClick={() => setCurrentPage("home")} className="mt-4 text-blue-600 hover:underline">Go back home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <button onClick={() => setCurrentPage("home")} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                    <ChevronLeft size={22} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
                    <p className="text-sm text-gray-500">{group.description}</p>
                    {group.tags && group.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {group.tags.map((tag: string) => (
                                <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => alert('Add to favorites not implemented yet')} className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="Add to Favorites">
                    <Star size={18} />
                </button>
                <button onClick={handleCopy} className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" title="Copy Group ID">
                    <Copy size={18} />
                </button>
            </div>
        </header>

        <main className="p-8">
            {message.text && (
                <div className={`p-3 rounded-lg text-center font-medium mb-6 transition-all duration-300 ${
                    message.type === 'success' ? "bg-green-100 text-green-700" : 
                    message.type === 'error' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}>
                    {message.text}
                </div>
            )}

            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('activities')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'activities' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Activities
                    </button>
                    <button onClick={() => setActiveTab('members')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'members' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Members
                    </button>
                </nav>
            </div>

            {activeTab === 'activities' && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Upcoming Activities</h2>
                        {isMember && (
                            <button onClick={() => navigateToAddActivity(selectedGroupId)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                                <PlusCircle size={16}/><span>Add Activity</span>
                            </button>
                        )}
                    </div>
                    {upcomingMeetups.length > 0 ? (
                        <ul className="space-y-4">
                            {upcomingMeetups.map((meetup: any) => (
                                <li key={meetup.id} className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">{meetup.title}</p>
                                        <p className="text-sm text-gray-500">{meetup.description || 'No description'}</p>
                                    </div>
                                    <span className="font-semibold text-blue-600">{formatDateTime(new Date(meetup.date_time))}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No upcoming activities scheduled.</p>
                    )}
                </div>
            )}

            {activeTab === 'members' && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Members ({groupMembers.length})</h2>
                    <ul className="space-y-3 mb-8">
                        {groupMembers.map((memberId: any) => (
                            <li key={memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <User size={18} className="text-gray-500"/>
                                    <span className="font-medium text-gray-700">{memberId === userId ? "You" : memberId}</span>
                                </div>
                                {memberId === group.user_id && <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center space-x-1"><Shield size={12}/><span>Owner</span></span>}
                            </li>
                        ))}
                    </ul>
                    
                    {isOwner ? (
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-800 mb-3">Owner Controls</h3>
                            <div className="space-y-4">
                                <button onClick={() => setAddMemberModalOpen(true)} className="w-full text-left flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                                    <PlusCircle size={20} className="text-blue-600"/>
                                    <span className="text-black">Add Member</span>
                                </button>
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Settings size={20} className="text-blue-600"/>
                                        <span className="text-black">{group.isPublic ? 'Set to Private' : 'Set to Public'}</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={!group.isPublic} onChange={handleTogglePrivate} />
                                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <button onClick={handleDeleteGroup} className="w-full text-left flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors">
                                    <Trash2 size={20}/>
                                    <span>Delete Group</span>
                                </button>
                            </div>
                        </div>
                    ) : ( isMember &&
                        <button onClick={handleLeaveGroup} className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors">
                            <LogOut size={18}/>
                            <span className="font-semibold">Leave Group</span>
                        </button>
                    )}
                </div>
            )}
        </main>

        {isAddMemberModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Add New Member</h3>
                    <input
                        type="text"
                        value={newMemberId}
                        onChange={(e) => setNewMemberId(e.target.value)}
                        className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Enter User ID to invite"
                    />
                    <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={() => setAddMemberModalOpen(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleConfirmAddMember} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 ">
                            Add Member
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

const formatDateTime = (date: any) => {
  if (!date) return "N/A";
  const d = new Date(date);
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return `${d.toLocaleDateString("en-US", dateOptions)} ${d.toLocaleTimeString("en-US", timeOptions)}`;
};