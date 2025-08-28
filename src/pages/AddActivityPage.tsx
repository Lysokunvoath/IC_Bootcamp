import { useState } from "react";
import { ChevronLeft, Info } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function AddActivityPage({
  selectedGroupId,
  setMeetups,
  setCurrentPage,
  userId,
}: any) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!date || !time) {
        setError("Please select a valid date and time.");
        setIsLoading(false);
        return;
    }

    const activityDateTime = new Date(`${date}T${time}`);

    try {
      const { data, error: insertError } = await supabase
        .from("meetups")
        .insert({
          title: title,
          date_time: activityDateTime.toISOString(),
          description: description,
          group_id: selectedGroupId,
          user_id: userId,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setMeetups((prevMeetups: any) => [...prevMeetups, data]);

      setTimeout(() => {
        setCurrentPage("groupDetail");
      }, 1000);

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
                onClick={() => setCurrentPage("groupDetail")}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            >
                <ChevronLeft size={22} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-4">Add New Activity</h1>
        </header>

        <main className="p-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
                <form onSubmit={handleAddActivity} className="space-y-6">
                    <div>
                        <label htmlFor="activityName" className="block text-sm font-medium text-gray-700 mb-1">Activity Title</label>
                        <input
                            id="activityName"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="e.g., Project Sync-up"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input
                                id="time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400">(Optional)</span></label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
                            placeholder="Any details about the activity..."
                        ></textarea>
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
                            {isLoading ? "Adding..." : "Add Activity"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
  );
}