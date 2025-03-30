import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import Book from '../models/Book.js';

  const registerUser = async (req, res) => {
  const { username, email, password, address,role } = req.body;
  
  try {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ msg: 'Username already exists' });
    }
    
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ msg: 'Email already exists' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      username,
      email: email.toLowerCase(), 
      password: hashedPassword,
      address,
      role,
    });
    
    await newUser.save();
    
    const token = generateToken(newUser._id,newUser.role);
    
    res.status(201).json({ message: "SignUp Successfully", token });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

  const loginUser = async (req, res) => {
  try {
    
    const user = await User.findOne({ username: req.body.username });
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Password incorrect" });
    }
    const token = generateToken(user._id,user.role);
      res.status(200).json({
      message: "Login successful",
      id: user._id,
      role: user.role,
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getUserInformation = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.headers.id;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select('-password'); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateUserInformation = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.headers.id;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { username, email, address, password } = req.body;
    
    const updatedFields = {};
    
    if (username) {
      updatedFields.username = username;
    }
    if (email) {
      updatedFields.email = email.toLowerCase();
    }
    if (address) {
      updatedFields.address = address;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true }).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User information updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

 const getAllUsers = async (req, res) => {
   try {
     const users = await User.find().select("-password"); // Exclude password from response

     if (!users) {
       return res.status(404).json({ message: "No users found" });
     }

     res.status(200).json(users);
   } catch (error) {
     console.error("Error fetching all users:", error);
     res.status(500).json({ message: "Internal server error" });
   }
 };
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export { registerUser, loginUser, getUserInformation,updateUserInformation,getAllUsers,deleteUser };

