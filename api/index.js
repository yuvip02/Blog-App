const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const User = require('./models/user');
const Post = require('./models/post');
require('./db'); // Ensure this initializes the db connection

const salt = bcrypt.genSaltSync(10);
const uploadMiddleware = multer({ dest: 'uploads/' });

const app = express();


const secret = "egrqergq387g34b43g";

// Correctly configure CORS to allow credentials and specify the correct origin
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json()); // Body parser
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const userDoc = await User.create({ username, password: bcrypt.hashSync(password, salt) });
    res.status(200).json(userDoc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    const passOk = await bcrypt.compare(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error generating token" });
        }
        res.cookie("token", token, { httpOnly: true }).json({ message: "Login successful", id: userDoc._id, username });
      });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("logged out");
});

app.get("/post", async (req, res) => {
  res.json(await Post.find()
  .populate("author",["username"])
.sort({createdAt:-1})
.limit(20)
);
});

app.post("/post", uploadMiddleware.single('file'), async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "JWT must be provided" });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;

    fs.renameSync(path, newPath);

    const { title, summary, content } = req.body;

    try {
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id
      });
      res.json(postDoc);
    } catch (err) {
      console.error("Error creating post:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(postDoc);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    try {
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }
      // Check if the user is the author of the post
      if (postDoc.author.toString() !== info.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      if (newPath) {
        postDoc.cover = newPath;
      }
      await postDoc.save(); // Save the updated document

      res.json(postDoc);
    } catch (err) {
      console.error('Error updating post:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
