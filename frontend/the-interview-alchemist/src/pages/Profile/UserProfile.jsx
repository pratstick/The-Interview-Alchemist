import React, { useContext, useEffect, useState } from "react";
import {
  LuUser,
  LuTarget,
  LuFlame,
  LuTrophy,
  LuBriefcase,
  LuMessageSquare,
  LuPin,
  LuFileText,
  LuCalendarDays,
  LuStar,
  LuPencil,
  LuCheck,
  LuX,
} from "react-icons/lu";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white rounded-xl p-5 shadow border border-amber-100 flex items-center gap-4">
    <div className={`rounded-full p-3 ${accent}`}>{icon}</div>
    <div>
      <div className="text-2xl font-bold text-gray-900">{value ?? "—"}</div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  </div>
);

// ── Achievement badge ─────────────────────────────────────────────────────────
const AchievementBadge = ({ icon, title, description, earned }) => (
  <div
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
      earned
        ? "bg-amber-50 border-amber-200 shadow-sm"
        : "bg-gray-50 border-gray-200 opacity-50 grayscale"
    }`}
  >
    <span className="text-3xl">{icon}</span>
    <p className="text-sm font-semibold text-gray-800">{title}</p>
    <p className="text-xs text-gray-500">{description}</p>
    {earned && (
      <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-medium">
        Earned ✓
      </span>
    )}
  </div>
);

// ── Goal editor ───────────────────────────────────────────────────────────────
const GoalEditor = ({ goals, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [daily, setDaily] = useState(goals?.dailySessionGoal ?? 1);
  const [weekly, setWeekly] = useState(goals?.weeklyQuestionGoal ?? 10);

  useEffect(() => {
    setDaily(goals?.dailySessionGoal ?? 1);
    setWeekly(goals?.weeklyQuestionGoal ?? 10);
  }, [goals]);

  const handleSave = async () => {
    const dailyVal = Math.max(1, Math.min(10, Number(daily)));
    const weeklyVal = Math.max(1, Math.min(200, Number(weekly)));
    await onSave({ dailySessionGoal: dailyVal, weeklyQuestionGoal: weeklyVal });
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow border border-amber-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <LuTarget className="text-amber-500" /> Goals
        </h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            <LuPencil size={14} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <LuCheck size={14} /> Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 font-medium"
            >
              <LuX size={14} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily session goal */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            Daily Session Goal
          </label>
          {editing ? (
            <input
              type="number"
              min={1}
              max={10}
              value={daily}
              onChange={(e) => setDaily(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 w-28"
            />
          ) : (
            <p className="text-xl font-bold text-gray-800">
              {goals?.dailySessionGoal ?? 1}{" "}
              <span className="text-sm font-normal text-gray-500">
                session{goals?.dailySessionGoal !== 1 ? "s" : ""}
              </span>
            </p>
          )}
        </div>

        {/* Weekly question goal */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            Weekly Question Goal
          </label>
          {editing ? (
            <input
              type="number"
              min={1}
              max={200}
              value={weekly}
              onChange={(e) => setWeekly(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 w-28"
            />
          ) : (
            <p className="text-xl font-bold text-gray-800">
              {goals?.weeklyQuestionGoal ?? 10}{" "}
              <span className="text-sm font-normal text-gray-500">
                question{goals?.weeklyQuestionGoal !== 1 ? "s" : ""}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ label, value, target, color }) => {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span>
          {value} / {target}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">{pct}%</p>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const UserProfile = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.PROGRESS.GET_STATS);
      setData(res.data);
    } catch {
      toast.error("Failed to load profile stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSaveGoals = async (newGoals) => {
    try {
      const res = await axiosInstance.put(
        API_PATHS.PROGRESS.UPDATE_GOALS,
        newGoals
      );
      setData((prev) => ({ ...prev, goals: res.data.goals }));
      toast.success("Goals updated!");
    } catch {
      toast.error("Failed to update goals");
    }
  };

  const stats = data?.stats;
  const achievements = data?.achievements ?? [];
  const goals = data?.goals;
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* ── Profile header ── */}
        <div className="bg-white rounded-2xl shadow border border-amber-100 p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={user?.profileImageUrl || "https://picsum.photos/200"}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-amber-200 object-cover shadow"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.name || "User"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              {stats?.currentStreak > 0 && (
                <span className="flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                  <LuFlame size={13} /> {stats.currentStreak}-day streak
                </span>
              )}
              <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                <LuTrophy size={13} /> {earnedCount} / {achievements.length}{" "}
                achievements
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <LuStar className="text-amber-500" /> Study Statistics
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<LuBriefcase className="text-amber-600 text-xl" />}
              label="Total Sessions"
              value={stats?.totalSessions}
              accent="bg-amber-100"
            />
            <StatCard
              icon={<LuMessageSquare className="text-blue-500 text-xl" />}
              label="Total Q&A"
              value={stats?.totalQuestions}
              accent="bg-blue-100"
            />
            <StatCard
              icon={<LuPin className="text-rose-500 text-xl" />}
              label="Pinned Qs"
              value={stats?.pinnedQuestions}
              accent="bg-rose-100"
            />
            <StatCard
              icon={<LuFileText className="text-violet-500 text-xl" />}
              label="Notes Added"
              value={stats?.questionsWithNotes}
              accent="bg-violet-100"
            />
            <StatCard
              icon={<LuCalendarDays className="text-emerald-500 text-xl" />}
              label="This Week"
              value={stats?.sessionsThisWeek}
              accent="bg-emerald-100"
            />
            <StatCard
              icon={<LuCalendarDays className="text-teal-500 text-xl" />}
              label="This Month"
              value={stats?.sessionsThisMonth}
              accent="bg-teal-100"
            />
            <StatCard
              icon={<LuFlame className="text-orange-500 text-xl" />}
              label="Current Streak"
              value={
                stats?.currentStreak
                  ? `${stats.currentStreak}d`
                  : "0d"
              }
              accent="bg-orange-100"
            />
            <StatCard
              icon={<LuTrophy className="text-yellow-500 text-xl" />}
              label="Best Streak"
              value={
                stats?.longestStreak
                  ? `${stats.longestStreak}d`
                  : "0d"
              }
              accent="bg-yellow-100"
            />
          </div>
        )}

        {/* ── Weekly progress vs goals ── */}
        {!loading && goals && (
          <div className="bg-white rounded-xl shadow border border-amber-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LuTarget className="text-amber-500" /> This Week's Progress
            </h2>
            <div className="flex flex-col gap-4">
              <ProgressBar
                label="Sessions"
                value={stats?.sessionsThisWeek ?? 0}
                target={goals.dailySessionGoal * 7}
                color="bg-amber-400"
              />
              <ProgressBar
                label="Questions answered"
                value={stats?.questionsThisWeek ?? 0}
                target={goals.weeklyQuestionGoal}
                color="bg-blue-400"
              />
            </div>
          </div>
        )}

        {/* ── Goals ── */}
        {!loading && (
          <div className="mb-8">
            <GoalEditor goals={goals} onSave={handleSaveGoals} />
          </div>
        )}

        {/* ── Achievements ── */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <LuTrophy className="text-amber-500" /> Achievements{" "}
          <span className="text-sm font-normal text-gray-500">
            ({earnedCount}/{achievements.length})
          </span>
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {achievements.map((a) => (
              <AchievementBadge
                key={a.id}
                icon={a.icon}
                title={a.title}
                description={a.description}
                earned={a.earned}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
