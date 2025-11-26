import express, {type  Request,type Response } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User, { IUser } from "../models/User";
import generateToken from "../utils/generateToken";
import {
  registerValidation,
  loginValidation,
} from "../validators/authValidators";

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    try {
      const userExists: IUser | null = await User.findOne({ email });
      if (userExists) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = generateToken(user._id.toString());

      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (err: any) {
      console.error("Register error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/login",
  loginValidation,
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const token = generateToken(user._id.toString());

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (err: any) {
      console.error("Login error:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
