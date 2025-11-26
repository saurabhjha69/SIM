import express, { type Request,type Response } from "express";
import { validationResult, body } from "express-validator";
import { protect } from "../middleware/auth";
import User from "../models/User";

const router = express.Router();

router.get(
  "/me",
  protect,
  (req: Request, res: Response): void => {
    res.json(req.user);
  }
);

router.put(
  "/me",
  protect,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email required"),
  ],
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

    const { name, email } = req.body as {
      name?: string;
      email?: string;
    };

    try {
      if (email && email !== req.user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          res.status(400).json({ message: "Email already in use" });
          return;
        }
      }

      req.user.name = name ?? req.user.name;
      req.user.email = email ?? req.user.email;

      const updatedUser = await req.user.save();

      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    } catch (err: any) {
      console.error("Update profile error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
