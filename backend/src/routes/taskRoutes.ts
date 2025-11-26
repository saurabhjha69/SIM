import express, { type Request,type Response } from "express";
import { validationResult } from "express-validator";
import { protect } from "../middleware/auth";
import Task, { ITask } from "../models/Task";
import {
  createTaskValidation,
  updateTaskValidation,
} from "../validators/taskValidators";

const router = express.Router();
router.use(protect);

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { search, status } = req.query as {
    search?: string;
    status?: string;
  };

  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const query: any = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  try {
    const tasks: ITask[] = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err: any) {
    console.error("Get tasks error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/",
  createTaskValidation,
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { title, description, status } = req.body as {
      title: string;
      description?: string;
      status: "todo" | "in-progress" | "done";
    };

    try {
      const task = await Task.create({
        user: req.user._id,
        title,
        description,
        status,
      });

      res.status(201).json(task);
    } catch (err: any) {
      console.error("Create task error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(task);
  } catch (err: any) {
    console.error("Get task error:", err.message);
    res.status(400).json({ message: "Invalid task ID" });
  }
});

router.put(
  "/:id",
  updateTaskValidation,
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }

      const { title, description, status } = req.body as {
        title?: string;
        description?: string;
        status?: "todo" | "in-progress" | "done";
      };

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) task.status = status;

      const updated = await task.save();
      res.json(updated);
    } catch (err: any) {
      console.error("Update task error:", err.message);
      res.status(400).json({ message: "Invalid task ID" });
    }
  }
);

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted" });
  } catch (err: any) {
    console.error("Delete task error:", err.message);
    res.status(400).json({ message: "Invalid task ID" });
  }
});

export default router;
