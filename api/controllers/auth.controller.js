import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Password validation checks
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password.length < 8 || password.length > 20) {
      return res
        .status(400)
        .json({ message: "Password must be between 8 to 20 characters long" });
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return res.status(400).json({
        message:
          "Password must have at least 1 uppercase and 1 lowercase letter",
      });
    }

    if (!/\d/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must include at least 1 number" });
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return res.status(400).json({
        message: "Password must include at least 1 special character",
      });
    }

    if (password === username) {
      return res
        .status(400)
        .json({ message: "Password cannot be the same as username" });
    }
    // Username validation checks
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (username.length > 20) {
      return res
        .status(400)
        .json({ message: "Username cannot exceed 20 characters" });
    }

    // Check for invalid characters in username
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res
        .status(400)
        .json({ message: "Username can only contain alphanumeric characters" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check for valid email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user already exists

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials..!" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials..!" });
    }

    // Generate cookie Token and send it to the user
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json({ userInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login..!!" });
  }
};
export const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logout successfully..!" });
};
