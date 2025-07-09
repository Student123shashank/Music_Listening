const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { authenticateToken, isAdmin } = require("./userAuth");
const { v4: uuidv4 } = require("uuid");



const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (username.length < 4)
      return res.status(400).json({ message: "Username must be at least 4 characters long" });

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res.status(400).json({ message: "Username or email already exists" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters long" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "Shashank@2024",
      { expiresIn: "60d" }
    );

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/upload-avatar", authenticateToken, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl });

    res.status(200).json({ success: true, avatarUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/update-profile", authenticateToken, async (req, res) => {
  const { username, email } = req.body;

  try {
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== req.user.id)
        return res.status(400).json({ message: "Username already taken" });
    }

    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== req.user.id)
        return res.status(400).json({ message: "Email already in use" });
    }

    await User.findByIdAndUpdate(req.user.id, { username, email });
    res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/update-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedNewPassword });

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/total-users", authenticateToken, async (_, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ status: "Success", count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user count" });
  }
});



router.get("/all-users", authenticateToken, async (_, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


router.put("/update-user/:id", authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    await User.findByIdAndUpdate(req.params.id, { username, email });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});


router.delete("/delete-user/:id", authenticateToken,  async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
