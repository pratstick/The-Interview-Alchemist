const User = require('../models/User');
const Session = require('../models/Session');
const Question = require('../models/Question');

// Achievement definitions
const ACHIEVEMENTS = [
    {
        id: 'first_session',
        title: 'First Step',
        description: 'Created your first session',
        icon: '🎯',
        check: (stats) => stats.totalSessions >= 1,
    },
    {
        id: 'five_sessions',
        title: 'Getting Started',
        description: 'Completed 5 sessions',
        icon: '🚀',
        check: (stats) => stats.totalSessions >= 5,
    },
    {
        id: 'ten_sessions',
        title: 'Interview Prep Pro',
        description: 'Completed 10 sessions',
        icon: '🏆',
        check: (stats) => stats.totalSessions >= 10,
    },
    {
        id: 'fifty_sessions',
        title: 'Interview Expert',
        description: 'Completed 50 sessions',
        icon: '💎',
        check: (stats) => stats.totalSessions >= 50,
    },
    {
        id: 'week_streak',
        title: 'Week Warrior',
        description: '7-day study streak',
        icon: '🔥',
        check: (stats) => stats.longestStreak >= 7,
    },
    {
        id: 'month_streak',
        title: 'Monthly Master',
        description: '30-day study streak',
        icon: '🌟',
        check: (stats) => stats.longestStreak >= 30,
    },
    {
        id: 'fifty_questions',
        title: 'Question Explorer',
        description: 'Answered 50+ questions',
        icon: '💡',
        check: (stats) => stats.totalQuestions >= 50,
    },
    {
        id: 'hundred_questions',
        title: 'Knowledge Builder',
        description: 'Answered 100+ questions',
        icon: '🧠',
        check: (stats) => stats.totalQuestions >= 100,
    },
    {
        id: 'ten_pinned',
        title: 'Curator',
        description: 'Pinned 10+ questions',
        icon: '📌',
        check: (stats) => stats.pinnedQuestions >= 10,
    },
    {
        id: 'ten_notes',
        title: 'Note Taker',
        description: 'Added notes to 10+ questions',
        icon: '📝',
        check: (stats) => stats.questionsWithNotes >= 10,
    },
];

// Calculate current and longest study streaks from an array of Date objects
function calculateStreaks(sessionDates) {
    if (!sessionDates.length) return { currentStreak: 0, longestStreak: 0 };

    // Get unique calendar day strings (UTC)
    const daySet = new Set(
        sessionDates.map((d) => d.toISOString().split('T')[0])
    );
    const days = [...daySet].sort();

    // Longest streak
    let longestStreak = 1;
    let run = 1;
    for (let i = 1; i < days.length; i++) {
        const diff =
            (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
        if (diff === 1) {
            run++;
            if (run > longestStreak) longestStreak = run;
        } else {
            run = 1;
        }
    }

    // Current streak: walk backward from today (or yesterday)
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000)
        .toISOString()
        .split('T')[0];

    let anchor = null;
    if (daySet.has(todayStr)) anchor = todayStr;
    else if (daySet.has(yesterdayStr)) anchor = yesterdayStr;

    let currentStreak = 0;
    if (anchor) {
        currentStreak = 1;
        let check = new Date(anchor);
        while (true) {
            check.setUTCDate(check.getUTCDate() - 1);
            const checkStr = check.toISOString().split('T')[0];
            if (daySet.has(checkStr)) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    return { currentStreak, longestStreak };
}

// @desc  Get progress stats for the logged-in user
// @route GET /api/progress/stats
// @access Private
exports.getProgressStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all sessions for the user (lightweight: only needed fields)
        const sessions = await Session.find({ user: userId })
            .select('createdAt questions')
            .populate({ path: 'questions', select: 'isPinned note' });

        const totalSessions = sessions.length;
        const totalQuestions = sessions.reduce(
            (acc, s) => acc + (s.questions?.length || 0),
            0
        );
        const pinnedQuestions = sessions.reduce(
            (acc, s) =>
                acc + (s.questions?.filter((q) => q.isPinned).length || 0),
            0
        );
        const questionsWithNotes = sessions.reduce(
            (acc, s) =>
                acc +
                (s.questions?.filter((q) => q.note && q.note.trim()).length ||
                    0),
            0
        );

        // Sessions this week (Mon–Sun, UTC)
        const now = new Date();
        const dayOfWeek = now.getUTCDay(); // 0=Sun
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const weekStart = new Date(now);
        weekStart.setUTCDate(now.getUTCDate() + mondayOffset);
        weekStart.setUTCHours(0, 0, 0, 0);
        const sessionsThisWeek = sessions.filter(
            (s) => new Date(s.createdAt) >= weekStart
        ).length;

        // Sessions this month
        const monthStart = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
        );
        const sessionsThisMonth = sessions.filter(
            (s) => new Date(s.createdAt) >= monthStart
        ).length;

        // Questions this week
        const questionsThisWeek = sessions
            .filter((s) => new Date(s.createdAt) >= weekStart)
            .reduce((acc, s) => acc + (s.questions?.length || 0), 0);

        // Streak calculation
        const sessionDates = sessions.map((s) => new Date(s.createdAt));
        const { currentStreak, longestStreak } = calculateStreaks(sessionDates);

        const stats = {
            totalSessions,
            totalQuestions,
            pinnedQuestions,
            questionsWithNotes,
            sessionsThisWeek,
            sessionsThisMonth,
            questionsThisWeek,
            currentStreak,
            longestStreak,
        };

        // Compute achievements
        const achievements = ACHIEVEMENTS.map(({ id, title, description, icon, check }) => ({
            id,
            title,
            description,
            icon,
            earned: check(stats),
        }));

        // User goals
        const user = await User.findById(userId).select('goals');
        const goals = user?.goals || { dailySessionGoal: 1, weeklyQuestionGoal: 10 };

        res.status(200).json({
            success: true,
            stats,
            achievements,
            goals,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc  Update goals for the logged-in user
// @route PUT /api/progress/goals
// @access Private
exports.updateGoals = async (req, res) => {
    try {
        const { dailySessionGoal, weeklyQuestionGoal } = req.body;

        if (
            typeof dailySessionGoal !== 'number' ||
            typeof weeklyQuestionGoal !== 'number'
        ) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid goal values' });
        }

        const daily = Math.max(1, Math.min(10, Math.floor(dailySessionGoal)));
        const weekly = Math.max(1, Math.min(200, Math.floor(weeklyQuestionGoal)));

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { goals: { dailySessionGoal: daily, weeklyQuestionGoal: weekly } },
            { new: true }
        ).select('goals');

        res.status(200).json({ success: true, goals: user.goals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
