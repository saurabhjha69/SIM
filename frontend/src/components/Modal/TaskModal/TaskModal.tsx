import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../../api/axios";
import type { Task, TaskStatus } from "../../../types/task";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
  onSuccess: () => void;
}

interface TaskFormValues {
  title: string;
  description?: string;
  status: TaskStatus;
}

export default function TaskModal({
  isOpen,
  onClose,
  initialTask,
  onSuccess,
}: TaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    setServerError(null);

    if (initialTask) {
      reset({
        title: initialTask.title,
        description: initialTask.description ?? "",
        status: initialTask.status,
      });
    } else {
      reset({ title: "", description: "", status: "todo" });
    }
  }, [initialTask, reset, isOpen]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setServerError(null);

      if (initialTask) {
        await API.put(`/tasks/${initialTask._id}`, data);
      } else {
        await API.post("/tasks", data);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      const responseErrors = error?.response?.data?.errors;

      if (Array.isArray(responseErrors)) {
        responseErrors.forEach((err: any) => {
          if (err.path) {
            setError(err.path as keyof TaskFormValues, {
              message: err.msg,
            });
          }
        });
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-night">
                {initialTask ? "Edit Task" : "Create Task"}
              </h2>
              <button
                onClick={onClose}
                className="text-amaranth hover:text-damaranth text-xl font-bold"
              >
                ×
              </button>
            </div>

            {serverError && (
              <p className="mb-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded-lg">
                {serverError}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-night mb-1">
                  Title
                </label>
                <input
                  className={`w-full text-black px-4 py-2 rounded-lg border ${
                    errors.title
                      ? "border-red-500"
                      : "border-gray-200 focus:ring-2 focus:ring-coral"
                  }`}
                  {...register("title", { required: "Title is required!" })}
                  placeholder="Task title"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-night mb-1">
                  Description
                </label>
                <textarea
                  className={`w-full text-black px-4 py-2 rounded-lg border ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-200 focus:ring-2 focus:ring-coral"
                  }`}
                  rows={3}
                  {...register("description",{required: "Description is Required!"})}
                  placeholder="Optional description..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-night mb-1">
                  Status
                </label>
                <select
                  className="w-full text-black px-4 py-2 rounded-lg outline-0 border border-gray-200 focus:ring-2 focus:ring-coral"
                  {...register("status")}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-night text-white py-2.5 rounded-lg font-semibold hover:bg-damaranth transition"
              >
                {initialTask ? "Save Changes" : "Create Task"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
