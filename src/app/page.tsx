"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  Plus,
  Check,
  X,
  BarChart3,
  Clock,
  Calendar,
  TrendingUp,
  Trophy,
  Target,
  Zap,
  Info,
  Brain,
  Heart,
  Lightbulb,
  Shield,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  startedAt?: number;
  timeSpent?: number; // in minutes
}

export default function LockedTodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [taskOrder, setTaskOrder] = useState<string[]>([]);
  const [currentTaskStartTime, setCurrentTaskStartTime] = useState<
    number | null
  >(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTasks = localStorage.getItem("lockedTodoTasks");
        const savedTaskOrder = localStorage.getItem("lockedTodoTaskOrder");
        const savedStartTime = localStorage.getItem(
          "lockedTodoCurrentStartTime"
        );

        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          setTasks(parsedTasks);
        }

        if (savedTaskOrder) {
          const parsedOrder = JSON.parse(savedTaskOrder);
          setTaskOrder(parsedOrder);
        }

        if (savedStartTime) {
          const parsedStartTime = JSON.parse(savedStartTime);
          setCurrentTaskStartTime(parsedStartTime);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("lockedTodoTasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
    }
  }, [tasks, isLoaded]);

  // Save task order to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("lockedTodoTaskOrder", JSON.stringify(taskOrder));
      } catch (error) {
        console.error("Error saving task order to localStorage:", error);
      }
    }
  }, [taskOrder, isLoaded]);

  // Save current task start time to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          "lockedTodoCurrentStartTime",
          JSON.stringify(currentTaskStartTime)
        );
      } catch (error) {
        console.error("Error saving start time to localStorage:", error);
      }
    }
  }, [currentTaskStartTime, isLoaded]);

  // Get the current active task (first incomplete task based on order)
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const activeTask =
    incompleteTasks.length > 0
      ? incompleteTasks.find((task) => task.id === taskOrder[0]) ||
        incompleteTasks[0]
      : undefined;
  const completedTasks = tasks.filter((task) => task.completed);
  const lockedTasks = incompleteTasks.filter(
    (task) => task.id !== activeTask?.id
  );

  // Start timing when a new task becomes active
  useEffect(() => {
    if (isLoaded && activeTask && !currentTaskStartTime) {
      const startTime = Date.now();
      setCurrentTaskStartTime(startTime);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeTask.id ? { ...task, startedAt: startTime } : task
        )
      );
    }
  }, [activeTask?.id, currentTaskStartTime, isLoaded]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      setTasks((prev) => [...prev, task]);
      setTaskOrder((prev) => [...prev, task.id]);
      setNewTask("");
      setShowAddForm(false);
    }
  };

  const completeTask = (taskId: string) => {
    const completionTime = Date.now();
    const task = tasks.find((t) => t.id === taskId);
    const timeSpent = task?.startedAt
      ? Math.round((completionTime - task.startedAt) / (1000 * 60))
      : 0;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: true,
              completedAt: completionTime,
              timeSpent: timeSpent,
            }
          : task
      )
    );

    // Reset timer
    setCurrentTaskStartTime(null);

    // Remove completed task from order
    setTaskOrder((prev) => prev.filter((id) => id !== taskId));

    // Show task selector if there are remaining tasks
    const remainingTasks = tasks.filter(
      (task) => !task.completed && task.id !== taskId
    );
    if (remainingTasks.length > 1) {
      setShowTaskSelector(true);
    }
  };

  const selectNextTask = (taskId: string) => {
    // Move selected task to the front of the order
    setTaskOrder((prev) => {
      const filtered = prev.filter((id) => id !== taskId);
      return [taskId, ...filtered];
    });
    setShowTaskSelector(false);
    setCurrentTaskStartTime(null); // Reset timer for new task
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setTaskOrder((prev) => prev.filter((id) => id !== taskId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
    if (e.key === "Escape") {
      setShowAddForm(false);
      setNewTask("");
      setShowTaskSelector(false);
      setShowAnalytics(false);
      setShowAbout(false);
    }
  };

  // Analytics calculations
  const getAnalytics = () => {
    const completed = tasks.filter((t) => t.completed);
    const totalTasks = tasks.length;
    const completionRate =
      totalTasks > 0 ? (completed.length / totalTasks) * 100 : 0;

    // Daily completion data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const dailyData = last7Days.map((date) => {
      const completedOnDate = completed.filter((task) => {
        if (!task.completedAt) return false;
        const taskDate = new Date(task.completedAt).toISOString().split("T")[0];
        return taskDate === date;
      }).length;

      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        completed: completedOnDate,
      };
    });

    // Time spent analysis
    const avgTimeSpent =
      completed.length > 0
        ? completed.reduce((sum, task) => sum + (task.timeSpent || 0), 0) /
          completed.length
        : 0;

    const totalTimeSpent = completed.reduce(
      (sum, task) => sum + (task.timeSpent || 0),
      0
    );

    // Productivity insights
    const tasksToday = completed.filter((task) => {
      if (!task.completedAt) return false;
      const today = new Date().toDateString();
      return new Date(task.completedAt).toDateString() === today;
    }).length;

    const tasksThisWeek = completed.filter((task) => {
      if (!task.completedAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(task.completedAt) >= weekAgo;
    }).length;

    // Task completion time distribution
    const timeDistribution = [
      {
        name: "0-5 min",
        value: completed.filter((t) => (t.timeSpent || 0) <= 5).length,
        color: "#10b981",
      },
      {
        name: "5-15 min",
        value: completed.filter(
          (t) => (t.timeSpent || 0) > 5 && (t.timeSpent || 0) <= 15
        ).length,
        color: "#3b82f6",
      },
      {
        name: "15-30 min",
        value: completed.filter(
          (t) => (t.timeSpent || 0) > 15 && (t.timeSpent || 0) <= 30
        ).length,
        color: "#f59e0b",
      },
      {
        name: "30+ min",
        value: completed.filter((t) => (t.timeSpent || 0) > 30).length,
        color: "#ef4444",
      },
    ];

    return {
      totalTasks,
      completedTasks: completed.length,
      pendingTasks: totalTasks - completed.length,
      completionRate,
      dailyData,
      avgTimeSpent,
      totalTimeSpent,
      tasksToday,
      tasksThisWeek,
      timeDistribution,
      longestTask: completed.reduce(
        (max, task) =>
          (task.timeSpent || 0) > (max.timeSpent || 0) ? task : max,
        completed[0]
      ),
      shortestTask: completed.reduce(
        (min, task) =>
          (task.timeSpent || 0) < (min.timeSpent || 0) ? task : min,
        completed[0]
      ),
    };
  };

  const analytics = getAnalytics();

  // Current task timer
  const getCurrentTaskTime = () => {
    if (!activeTask || !currentTaskStartTime) return 0;
    return Math.round((Date.now() - currentTaskStartTime) / (1000 * 60));
  };

  // Clear all data function for testing/reset
  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all tasks and data? This cannot be undone."
      )
    ) {
      localStorage.removeItem("lockedTodoTasks");
      localStorage.removeItem("lockedTodoTaskOrder");
      localStorage.removeItem("lockedTodoCurrentStartTime");
      setTasks([]);
      setTaskOrder([]);
      setCurrentTaskStartTime(null);
    }
  };

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">SafeFocus</h1>
            <p className="text-gray-400">Secure your tasks, focus on one</p>
            {tasks.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Data automatically saved • {completedTasks.length} completed of{" "}
                {tasks.length} total
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAbout(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-colors flex items-center gap-2"
              title="About This Project"
            >
              <Info className="w-5 h-5" />
              About
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors flex items-center gap-2"
              title="View Analytics"
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
            {tasks.length > 0 && (
              <button
                onClick={clearAllData}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors text-sm"
                title="Clear All Data"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Safe Side - Locked Tasks */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Safe ({lockedTasks.length} locked)
              </h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                title="Add new task"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Add Task Form */}
            {showAddForm && (
              <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter new task..."
                  className="w-full bg-gray-600 text-gray-100 px-3 py-2 rounded border border-gray-500 focus:border-blue-500 focus:outline-none mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={addTask}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTask("");
                    }}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Safe Vault Visual */}
            <div className="bg-gray-900 rounded-lg p-8 border-2 border-gray-600 relative">
              <div className="absolute top-4 right-4">
                <Lock className="w-8 h-8 text-gray-500" />
              </div>

              {lockedTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Lock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Safe is empty</p>
                  <p className="text-sm">Add tasks to fill the safe</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lockedTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="bg-gray-800 p-3 rounded border border-gray-600 opacity-60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Task #{index + 2} (Locked)
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete task"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-gray-500 text-sm mt-1 blur-sm select-none">
                        {task.text.replace(/./g, "•")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 text-sm text-gray-400 text-center">
              {tasks.length > 0 && (
                <p>
                  {completedTasks.length} completed • {lockedTasks.length}{" "}
                  locked
                </p>
              )}
            </div>
          </div>

          {/* Active Task Side */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6">Current Task</h2>

            {activeTask ? (
              <div className="space-y-6">
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-blue-400 text-sm font-medium">
                      Task #1 - Active
                    </span>
                    <button
                      onClick={() => deleteTask(activeTask.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete task"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-lg text-gray-100 mb-4 leading-relaxed">
                    {activeTask.text}
                  </p>

                  {/* Current Task Timer */}
                  <div className="bg-gray-600 p-3 rounded-lg mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Time spent:</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-mono text-blue-400">
                        {getCurrentTaskTime()}m
                      </span>
                      <div className="text-xs text-gray-400">
                        Started:{" "}
                        {currentTaskStartTime
                          ? new Date(currentTaskStartTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )
                          : "--:--"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => completeTask(activeTask.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Check className="w-5 h-5" />
                    Mark Complete
                  </button>
                </div>

                {/* Progress Indicator */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm text-gray-400">
                      {completedTasks.length} / {tasks.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width:
                          tasks.length > 0
                            ? `${(completedTasks.length / tasks.length) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                {tasks.length === 0 ? (
                  <div className="text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                      <Plus className="w-8 h-8" />
                    </div>
                    <p className="text-lg mb-2">No tasks yet</p>
                    <p className="text-sm">
                      Add your first task to get started
                    </p>
                  </div>
                ) : (
                  <div className="text-green-400">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-900 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8" />
                    </div>
                    <p className="text-lg mb-2">All tasks completed!</p>
                    <p className="text-sm text-gray-400">
                      Great job finishing everything
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-600">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Completed ({completedTasks.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-700 p-3 rounded border border-gray-600 opacity-70"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 line-through text-sm">
                          {task.text}
                        </span>
                        {task.timeSpent && (
                          <span className="text-xs text-gray-500 ml-auto">
                            {task.timeSpent}m
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About Modal */}
        {showAbout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Info className="w-6 h-6 text-indigo-400" />
                  About SafeFocus
                </h3>
                <button
                  onClick={() => setShowAbout(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Hero Section */}
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-lg mb-6 text-center">
                <div className="flex justify-center items-center gap-4 mb-4">
                  <Brain className="w-12 h-12 text-indigo-400" />
                  <Heart className="w-8 h-8 text-red-400" />
                  <Lightbulb className="w-10 h-10 text-yellow-400" />
                </div>
                <h4 className="text-2xl font-bold mb-2 text-white">
                  SafeFocus: For the Ambitious but Lazy
                </h4>
                <p className="text-indigo-200 text-lg">
                  A productivity solution designed for creative minds who
                  struggle with traditional task management
                </p>
              </div>

              {/* The Problem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-green-400">
                        High Openness
                      </h5>
                      <p className="text-sm text-gray-400">
                        Creative & Dynamic
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• Love new experiences and creative challenges</p>
                    <p>• Prefer dynamic, non-linear approaches</p>
                    <p>• Think outside the box naturally</p>
                    <p>• Get bored with routine and simple paths</p>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-orange-400">
                        Low Conscientiousness
                      </h5>
                      <p className="text-sm text-gray-400">
                        Struggles with Structure
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• Difficulty following rigid rules and schedules</p>
                    <p>• Procrastination and task avoidance</p>
                    <p>• Overwhelmed by long to-do lists</p>
                    <p>• Lacks consistent discipline systems</p>
                  </div>
                </div>
              </div>

              {/* The Contradiction */}
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-6">
                <div className="text-center mb-4">
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <Brain className="w-6 h-6" />
                      <span className="font-semibold">Big Dreams</span>
                    </div>
                    <span className="text-2xl">+</span>
                    <div className="flex items-center gap-2 text-orange-400">
                      <Clock className="w-6 h-6" />
                      <span className="font-semibold">Poor Execution</span>
                    </div>
                    <span className="text-2xl">=</span>
                    <div className="flex items-center gap-2 text-red-400">
                      <X className="w-6 h-6" />
                      <span className="font-semibold">Frustration</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg">
                    Sound familiar? You&apos;re not alone in this struggle.
                  </p>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-600">
                  <h6 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    The Ambitious but Lazy Paradox
                  </h6>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    You have incredible ideas and the potential to achieve great
                    things, but traditional productivity systems feel
                    restrictive and overwhelming. You start projects with
                    enthusiasm but struggle to maintain momentum when faced with
                    mundane, structured approaches.
                  </p>
                </div>
              </div>

              {/* The Solution */}
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-6 rounded-lg mb-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h5 className="text-2xl font-bold text-white mb-2">
                    The SafeFocus Solution
                  </h5>
                  <p className="text-blue-200">
                    A gentle approach to productivity that works with your
                    nature, not against it
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-300" />
                      <h6 className="font-semibold text-blue-200">
                        Safe Storage
                      </h6>
                    </div>
                    <p className="text-sm text-blue-100">
                      Hide overwhelming tasks in a &quot;safe&quot; where you
                      can&apos;t see them, reducing anxiety and decision
                      fatigue.
                    </p>
                  </div>

                  <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-300" />
                      <h6 className="font-semibold text-blue-200">
                        Single Focus
                      </h6>
                    </div>
                    <p className="text-sm text-blue-100">
                      Work on only one task at a time, eliminating the paralysis
                      of choice and promoting deep focus.
                    </p>
                  </div>

                  <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-300" />
                      <h6 className="font-semibold text-blue-200">
                        Progress Tracking
                      </h6>
                    </div>
                    <p className="text-sm text-blue-100">
                      Visual analytics help you understand your patterns and
                      build confidence in your abilities.
                    </p>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-6">
                <h5 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-green-400" />
                  How It Breaks the Cycle
                </h5>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      1
                    </div>
                    <div className="flex-1">
                      <h6 className="font-semibold text-green-400 mb-1">
                        Reduces Overwhelm
                      </h6>
                      <p className="text-gray-300 text-sm">
                        By hiding most tasks, your brain doesn&apos;t get
                        overwhelmed by the sheer volume of work ahead.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      2
                    </div>
                    <div className="flex-1">
                      <h6 className="font-semibold text-blue-400 mb-1">
                        Promotes Flow State
                      </h6>
                      <p className="text-gray-300 text-sm">
                        Single-task focus allows your creative mind to dive deep
                        without distractions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      3
                    </div>
                    <div className="flex-1">
                      <h6 className="font-semibold text-purple-400 mb-1">
                        Builds Momentum
                      </h6>
                      <p className="text-gray-300 text-sm">
                        Each completed task unlocks the next, creating a sense
                        of progress and achievement.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      4
                    </div>
                    <div className="flex-1">
                      <h6 className="font-semibold text-orange-400 mb-1">
                        Provides Insights
                      </h6>
                      <p className="text-gray-300 text-sm">
                        Analytics help you understand your productivity patterns
                        and celebrate your wins.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Touch */}
              <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-3">
                  <Heart className="w-8 h-8 text-pink-400" />
                </div>
                <h5 className="text-xl font-bold text-white mb-2">
                  Made with Understanding
                </h5>
                <p className="text-purple-200 leading-relaxed">
                  SafeFocus was born from personal experience with the
                  ambitious-but-lazy struggle. It&apos;s designed by someone who
                  understands the unique challenges of having a creative, open
                  mind while struggling with traditional productivity systems.
                </p>
                <div className="mt-4 pt-4 border-t border-purple-700">
                  <p className="text-sm text-purple-300">
                    <strong>Remember:</strong> Your struggle with traditional
                    productivity doesn&apos;t make you lazy— it makes you human.
                    You just need tools that work with your brain, not against
                    it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        {showAnalytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  Task Analytics
                </h3>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-400">Total Tasks</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">
                    {analytics.totalTasks}
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-400">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    {analytics.completedTasks}
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-gray-400">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">
                    {analytics.completionRate.toFixed(0)}%
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="text-sm text-gray-400">Avg Time</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-400">
                    {analytics.avgTimeSpent.toFixed(0)}m
                  </p>
                </div>
              </div>

              {/* Daily Progress Chart */}
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Daily Progress (Last 7 Days)
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#374151",
                          border: "1px solid #4b5563",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar
                        dataKey="completed"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Time Distribution Pie Chart */}
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Task Duration Distribution
                  </h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.timeDistribution.filter(
                            (d) => d.value > 0
                          )}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                        >
                          {analytics.timeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#374151",
                            border: "1px solid #4b5563",
                            borderRadius: "0.5rem",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analytics.timeDistribution
                      .filter((d) => d.value > 0)
                      .map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-1 text-xs"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-300">
                            {item.name}: {item.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Productivity Insights */}
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <h4 className="text-lg font-semibold mb-4">
                    Productivity Insights
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">
                        Tasks completed today:
                      </span>
                      <span className="font-semibold text-green-400">
                        {analytics.tasksToday}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tasks this week:</span>
                      <span className="font-semibold text-blue-400">
                        {analytics.tasksThisWeek}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total time spent:</span>
                      <span className="font-semibold text-purple-400">
                        {analytics.totalTimeSpent}m
                      </span>
                    </div>
                    {analytics.longestTask && (
                      <div className="pt-2 border-t border-gray-600">
                        <p className="text-sm text-gray-400">Longest task:</p>
                        <p className="text-sm text-gray-300 truncate">
                          {analytics.longestTask.text}
                        </p>
                        <p className="text-xs text-orange-400">
                          {analytics.longestTask.timeSpent}m
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Completions */}
              {completedTasks.length > 0 && (
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-4">
                  <h4 className="text-lg font-semibold mb-4">
                    Recent Completions
                  </h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {completedTasks
                      .sort(
                        (a, b) => (b.completedAt || 0) - (a.completedAt || 0)
                      )
                      .slice(0, 5)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between bg-gray-600 p-3 rounded"
                        >
                          <div className="flex-1">
                            <p className="text-gray-100 text-sm">{task.text}</p>
                            <p className="text-xs text-gray-400">
                              {task.completedAt
                                ? new Date(
                                    task.completedAt
                                  ).toLocaleDateString() +
                                  " " +
                                  new Date(task.completedAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )
                                : "Unknown"}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-blue-400">
                              {task.timeSpent || 0}m
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Data Management */}
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 text-center">
                <p className="text-sm text-gray-400 mb-2">Data Management</p>
                <button
                  onClick={clearAllData}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm"
                >
                  Clear All Data
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  All data is automatically saved to your browser&apos;s local
                  storage
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Task Selector Modal */}
        {showTaskSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Choose Your Next Task
              </h3>
              <p className="text-gray-400 text-sm text-center mb-6">
                Select which task you&apos;d like to work on next from the safe
              </p>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {lockedTasks.map((task, index) => (
                  <button
                    key={task.id}
                    onClick={() => selectNextTask(task.id)}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 p-4 rounded-lg border border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-100">{task.text}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Added {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-600">
                <button
                  onClick={() => setShowTaskSelector(false)}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition-colors"
                >
                  Keep Current Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
