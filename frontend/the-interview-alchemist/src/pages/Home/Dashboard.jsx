import React, { useEffect, useState } from "react";
import { LuPlus, LuBriefcase, LuMessageSquare, LuPin, LuRefreshCw, LuSearch } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { format } from "date-fns";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import Modal from "../../components/Modal";
import emptyStateImg from "../../assets/empty-state.svg";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ open: false, data: null });

  // For search/filter
  const [search, setSearch] = useState("");

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to fetch sessions");
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
      toast.success("Session deleted successfully");
      setOpenDeleteAlert({ open: false, data: null });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  // Filter sessions by search
  const filteredSessions = sessions.filter(
    (data) =>
      data?.role?.toLowerCase().includes(search.toLowerCase()) ||
      data?.topicsToFocus?.toLowerCase().includes(search.toLowerCase()) ||
      data?.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalSessions = sessions.length;
  const totalQuestions = sessions.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
  const pinnedQuestions = sessions.reduce(
    (acc, s) => acc + (s.questions?.filter(q => q.isPinned).length || 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Welcome/Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ready to ace your next interview? Manage your sessions or start a new one below.
          </p>
        </div>

        {/* Stats/Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-amber-100 dark:border-gray-700 flex items-center gap-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full p-3">
              <LuBriefcase className="text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalSessions}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sessions</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-amber-100 dark:border-gray-700 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-full p-3">
              <LuMessageSquare className="text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalQuestions}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Q&A</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-amber-100 dark:border-gray-700 flex items-center gap-4">
            <div className="bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 rounded-full p-3">
              <LuPin className="text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pinnedQuestions}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pinned Qs</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-amber-100 dark:border-gray-700 flex items-center gap-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 rounded-full p-3">
              <LuRefreshCw className="text-xl" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{sessions.filter(s => s.updatedAt).length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Recently Updated</div>
            </div>
          </div>
        </div>

        {/* Search/Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:w-96">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by role, topic, or description..."
              className="w-full border border-gray-200 dark:border-gray-700 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800 bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Empty State Illustration */}
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <img
              src={emptyStateImg}
              alt="No interview sessions found"
              className="w-40 mb-4"
            />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No interview sessions found.</p>
            <button
              className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-white font-semibold px-6 py-2.5 rounded-full shadow hover:shadow-md transition-shadow"
              onClick={() => setOpenCreateModal(true)}
            >
              Create your first session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length].bgcolor}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || "-"}
                questions={data?.questions.length || "-"}
                description={data?.description || ""}
                lastUpdated={
                  data?.updatedAt
                    ? format(new Date(data?.updatedAt), "do MMM yyyy")
                    : ""
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => {
                  setOpenDeleteAlert({ open: true, data });
                }}
              />
            ))}
          </div>
        )}

        {/* Interview Tip Section */}
        <div className="mt-10">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Interview Tip</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Practice behavioral questions as much as technical ones! Consistency and confidence are key.</p>
            </div>
          </div>
        </div>

        {/* Add New Button */}
        <button
          className="fixed bottom-8 right-8 flex items-center gap-2 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] hover:from-[#e99a4b] hover:to-[#FF9324] text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-all"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-2xl text-white" />
          Add New
        </button>
      </div>

      {/* Create Session Modal */}
      <Modal 
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader>
        <div>
          <CreateSessionForm />
        </div>
      </Modal>

      {/* Delete Alert Modal */}
      <Modal
        isOpen={openDeleteAlert.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Alert">
        <div className="w-full min-w-[220px] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
          <DeleteAlertContent
            content={`Are you sure you want to delete the session for ${openDeleteAlert.data?.role}?`}
            onDelete={() => {
              deleteSession(openDeleteAlert.data);
              setOpenDeleteAlert({ open: false, data: null });
            }} />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;