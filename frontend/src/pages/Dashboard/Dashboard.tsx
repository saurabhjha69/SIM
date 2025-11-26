import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../api/axios";
import TaskCard from "../../components/TaskCard/TaskCard";
import TaskModal from "../../components/Modal/TaskModal/TaskModal";
import TaskSkeleton from "../../components/TaskSkeleton/TaskSkeleton";
import type { Task } from "../../types/task";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    const res = await API.get(`/tasks${query ? `?search=${query}` : ``}`);
    setTasks(res.data);
    setTimeout(()=>{
      setLoading(false);
    },2000)
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-amaranth text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Task Dashboard</h1>
            <p className="text-sm text-white/70 mt-1">
              Manage your tasks, track progress, and stay organized.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex text-white items-center justify-center px-4 py-2.5 rounded-xl bg-night text-night font-semibold shadow-lg hover:brightness-110 transition"
          >
            + Add Task
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            className="flex-1 px-4 py-2.5 rounded-xl bg-night/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-night text-sm"
            placeholder="Search tasks by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadTasks()}
          />

          <button
            onClick={loadTasks}
            className="px-4 py-2.5 rounded-xl bg-damaranth text-white text-sm font-semibold hover:bg-damaranth transition"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="border border-white/10 rounded-2xl p-8 text-center text-white/70">
            No tasks found. Click <span className="font-semibold">“Add Task”</span> to
            create your first task.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            layout
          >
            <AnimatePresence>
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  refresh={loadTasks}
                  onEdit={openEditModal}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTask={editingTask}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
