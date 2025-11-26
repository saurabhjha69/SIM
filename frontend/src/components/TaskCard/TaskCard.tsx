import { motion } from "framer-motion";
import API from "../../api/axios";
import type { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
  refresh: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, refresh, onEdit }: TaskCardProps) {
  const deleteTask = async () => {
    const areUSure = confirm("Are you sure about that?")
    if(areUSure) {
      
      await API.delete(`/tasks/${task._id}`);
      refresh();
    }
    else return
  };

  const statusColor =
    task.status === "done"
      ? "bg-coral"
      : task.status === "in-progress"
      ? "bg-sand"
      : "bg-night";

  return (
    <motion.div
      className="p-5 relative rounded-xl bg-damaranth text-white shadow-lg border border-white/10"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      layout
    >
      <h3 className="text-xl font-bold mb-1 overflow-hidden text-ellipsis break-words line-clamp-2 h-[60px]">{task.title}</h3>
      {task.description && (
        <p className="text-sm opacity-90 mb-3 overflow-hidden text-ellipsis break-words line-clamp-3 h-[80px] ">{task.description}</p>
      )}

      <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center mt-2">
        <span
          className={`${statusColor} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}
        >
          {task.status}
        </span>

        <div className="space-x-3 text-sm">
          <button
            onClick={() => onEdit(task)}
            className="hover:underline text-coral"
          >
            Edit
          </button>
          <button
            onClick={deleteTask}
            className="text-night bg-coral py-1 px-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
