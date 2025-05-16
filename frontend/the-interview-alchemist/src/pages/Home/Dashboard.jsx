import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import Modal from "../../components/Modal";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ open: false, data: null });
  const [error, setError] = useState(null);

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
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">
            Ready to ace your next interview? Manage your sessions or start a new one below.
          </p>
        </div>

        {/* Stats/Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{totalSessions}</div>
            <div className="text-xs text-gray-600">Sessions</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{totalQuestions}</div>
            <div className="text-xs text-gray-600">Total Q&A</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{pinnedQuestions}</div>
            <div className="text-xs text-gray-600">Pinned Qs</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{sessions.filter(s => s.updatedAt).length}</div>
            <div className="text-xs text-gray-600">Recently Updated</div>
          </div>
        </div>

        {/* Search/Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="Search by role, topic, or description..."
            className="w-full sm:w-96 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Empty State Illustration */}
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <img
              src="https://illustrations.popsy.co/amber/team-idea.svg"
              alt=" Source: popsy.co"
              className="w-40 mb-4"
            />
            <p className="text-gray-500 mb-2">No interview sessions found.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
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
                    ? moment(data?.updatedAt).format("Do MMM YYYY")
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
          <h2 className="text-lg font-semibold mb-2">Interview Tip</h2>
          <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-800">
            Practice behavioral questions as much as technical ones! Consistency and confidence are key.
          </div>
        </div>

        {/* Add New Button */}
        <button
          className="fixed bottom-8 right-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-colors"
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