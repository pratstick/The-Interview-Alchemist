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
import { getProfileImageUrl, FALLBACK_AVATAR } from "../../utils/helper";
import toast from "react-hot-toast";

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-amber-100/80 dark:border-gray-700/80 flex items-center gap-4 transition-colors">
    <div className={`rounded-full p-3 ${accent}`}>{icon}</div>
    <div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value ?? "—"}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</div>
    </div>
  </div>
);

// ── Achievement badge ─────────────────────────────────────────────────────────
const AchievementBadge = ({ icon, title, description, earned }) => (
  <div
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
      earned
        ? "bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 shadow-sm"
        : "bg-gray-50/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/60 opacity-40 grayscale"
    }`}
  >
    <span className="text-3xl">{icon}</span>
    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-amber-100/80 dark:border-gray-700/80 p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <LuTarget className="text-amber-500" /> Goals
        </h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium cursor-pointer"
          >
            <LuPencil size={14} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium cursor-pointer"
            >
              <LuCheck size={14} /> Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium cursor-pointer"
            >
              <LuX size={14} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily session goal */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Daily Session Goal
          </label>
          {editing ? (
            <input
              type="number"
              min={1}
              max={10}
              value={daily}
              onChange={(e) => setDaily(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 w-28"
            />
          ) : (
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {goals?.dailySessionGoal ?? 1}{" "}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                session{goals?.dailySessionGoal !== 1 ? "s" : ""}
              </span>
            </p>
          )}
        </div>

        {/* Weekly question goal */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Weekly Question Goal
          </label>
          {editing ? (
            <input
              type="number"
              min={1}
              max={200}
              value={weekly}
              onChange={(e) => setWeekly(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 w-28"
            />
          ) : (
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {goals?.weeklyQuestionGoal ?? 10}{" "}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
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
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
        <span>{label}</span>
        <span>
          {value} / {target}
        </span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{pct}%</p>
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-amber-100/80 dark:border-gray-700/80 p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-colors">
          <img
            src={getProfileImageUrl(user?.profileImageUrl)}
            alt="Profile"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_AVATAR; }}
            className="w-20 h-20 rounded-full border-4 border-amber-200 dark:border-amber-600/50 object-cover shadow"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user?.name || "User"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              {stats?.currentStreak > 0 && (
                <span className="flex items-center gap-1 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200/60 dark:border-orange-800/40">
                  <LuFlame size={13} /> {stats.currentStreak}-day streak
                </span>
              )}
              <span className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/40">
                <LuTrophy size={13} /> {earnedCount} / {achievements.length}{" "}
                achievements
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <LuStar className="text-amber-500" /> Study Statistics
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<LuBriefcase className="text-amber-600 dark:text-amber-400 text-xl" />}
              label="Total Sessions"
              value={stats?.totalSessions}
              accent="bg-amber-100 dark:bg-amber-950/50"
            />
            <StatCard
              icon={<LuMessageSquare className="text-blue-500 dark:text-blue-400 text-xl" />}
              label="Total Q&A"
              value={stats?.totalQuestions}
              accent="bg-blue-100 dark:bg-blue-950/50"
            />
            <StatCard
              icon={<LuPin className="text-rose-500 dark:text-rose-400 text-xl" />}
              label="Pinned Qs"
              value={stats?.pinnedQuestions}
              accent="bg-rose-100 dark:bg-rose-950/50"
            />
            <StatCard
              icon={<LuFileText className="text-violet-500 dark:text-violet-400 text-xl" />}
              label="Notes Added"
              value={stats?.questionsWithNotes}
              accent="bg-violet-100 dark:bg-violet-950/50"
            />
            <StatCard
              icon={<LuCalendarDays className="text-emerald-500 dark:text-emerald-400 text-xl" />}
              label="This Week"
              value={stats?.sessionsThisWeek}
              accent="bg-emerald-100 dark:bg-emerald-950/50"
            />
            <StatCard
              icon={<LuCalendarDays className="text-teal-500 dark:text-teal-400 text-xl" />}
              label="This Month"
              value={stats?.sessionsThisMonth}
              accent="bg-teal-100 dark:bg-teal-950/50"
            />
            <StatCard
              icon={<LuFlame className="text-orange-500 dark:text-orange-400 text-xl" />}
              label="Current Streak"
              value={
                stats?.currentStreak
                  ? `${stats.currentStreak}d`
                  : "0d"
              }
              accent="bg-orange-100 dark:bg-orange-950/50"
            />
            <StatCard
              icon={<LuTrophy className="text-yellow-500 dark:text-yellow-400 text-xl" />}
              label="Best Streak"
              value={
                stats?.longestStreak
                  ? `${stats.longestStreak}d`
                  : "0d"
              }
              accent="bg-yellow-100 dark:bg-yellow-950/50"
            />
          </div>
        )}

        {/* ── Weekly progress vs goals ── */}
        {!loading && goals && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-amber-100/80 dark:border-gray-700/80 p-6 mb-8 transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <LuTrophy className="text-amber-500" /> Achievements{" "}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({earnedCount}/{achievements.length})
          </span>
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-32" />
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
