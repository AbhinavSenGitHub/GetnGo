require("dotenv").config();
const express = require("express");
const User = require("./mongo");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieSession = require("cookie-session");
const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
const multer = require("multer");
const path = require("path");
// const passportSetup = require("./passport");
// const uuid = require('uuid');
// const authRoutes = require("./routes/auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';
const { v4: uuidv4 } = require('uuid');
const uniqueId = uuidv4();
const app = express();
const formidable = require("formidable");
const cloudinary = require("cloudinary");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/image", express.static(path.join(__dirname, "public")));
const {MongoClient, ObjectId} = require('mongodb')
// cloudinary setup
cloudinary.config({
  cloud_name: "getngo",
  api_key: process.env.API_CLOUDINARY_KEY,
  api_secret: process.env.API_CLOUDINARY_SECRET,
  secure: true,
});

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
// app.use(passport.initialize());
// app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "public/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage }); //this will allow to save and any time we need to upload any file we will use this variable called * upload *
// session set-up
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });
// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

app.post("/api/signup", async (req, res) => {
  const { username, password, number, concent } = req.body;
  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ number });
    if (existingUser) {
      res.status(409).json({ message: 'Username already exists', success: false });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const newUser = new User({
        username,
        password: hashedPassword,
        number,
        concent
      });
      // Save the user in the database
      await newUser.save()
      let token = jwt.sign({ number }, SECRET_KEY, { expiresIn: '1h' });
      const successMessage = 'Signup successful! Welcome to our platform.'
      res.status(200).json({ message: successMessage, success: true, token });
    }
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'An error occurred while signing up' });
  }
});


app.post("/api/login", async (req, res) => {
  const { number, password } = req.body
  try {
    // Find the user by username
    const user = await User.findOne({ number });
    if (!user) {
      return res.status(401).json({ message: 'User not found with that number', success: false });
    }
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password', success: false });
    }
    const token = jwt.sign({ number: number }, SECRET_KEY);
    // console.log(token);
    // res.json({ token });
    res.status(200).json({ message: 'Login successful', success: true, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
})

function convertUUIDtoObjectId(uuid) {
  const hex = uuid.replace(/-/g, '');
  const buffer = Buffer.from(hex, 'hex');
  const objectId = new ObjectId(buffer);
  return objectId;
}

app.post("/api/host", upload.array("image", 16), async (req, res) => {
  const {
    vehicle,
    company,
    name,
    fuleType,
    registrationYear,
    transmissionType,
    seats,
    fastag,
    kmDriven,
    cityName,
    feedback,
    price,
  } = req.body;

  let imagePath = [];
  for (let i = 0; i < req.files.length; i++) {
    const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
      req.files[i].path,
      {
        folder: "getngo",
        fetch_format: "webp",
      }
    );
    imagePath.push({ secure_url, public_id });
  }
  try {
    const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_KEY);
    // console.log(decodedToken)
    const number = decodedToken.number
    // Find the user by username
    const user = await User.findOne({ number })
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    // Add the new post to the user's posts array
    user.host.push({
      image: imagePath,
      vehicle,
      company,
      name,
      fuleType,
      registrationYear,
      transmissionType,
      seats,
      fastag,
      kmDriven,
      cityName,
      feedback,
      price,
      host_id: new ObjectId(),
      // postID: uuid.v4(),
    });
    // Save the updated user document
    await user.save()
    // console.log("statue after host:-" + res.status())
    res.status(201).json({ message: 'Post created successfully', success: true });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'An error occurred while creating the post' });
  }

})

function authenticateJWT(req, res, next) {
  const token = req.header('Authorization');
  // console.log("token: " + token);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  jwt.verify(token.replace('Bearer ', ''), SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: err });
    req.user = user;
    next();
  });
}
app.get("/api/profile", authenticateJWT, async (req, res) => {
  const user = req.user.number;
  try {
    const userPosts = await User.find({ number: user });
    res.json(userPosts);
  } catch (error) {
    console.error('Error fetching user posts', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // Assuming query parameter is 'query'
    console.log(query)
    if (!query || query.trim() === '') {
      // If the query is empty or only contains whitespace, retrieve all users
      const allUsers = await User.find();
      if (allUsers.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      // Return all users
      return res.json(allUsers);
    }
    const usersWithQueryString = await User.aggregate([
      {
      $match: {
          'host.cityName': { $regex: query, $options: 'i' }
        }
      },
      {
        $unwind: '$host'
      },
      {
        $match: {
          'host.cityName': { $regex: query, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          number: { $first: '$number' },
          host: { $push: '$host' }
        }
      },
      {
        $project: {
          username: 1,
          number: 1,
          host: 1
        }
      }
    ]);
    console.log(usersWithQueryString);
    if (!usersWithQueryString) {
      console.log("not found")
      return res.status(404).json({ message: 'User not found for the specified city' });
    }
    if (usersWithQueryString) {
      res.json(usersWithQueryString)
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete("/api/delete/users/:userId/hosts/:hostId", async (req, res) => {
  const {userId, hostId} = req.params;
  console.log(userId, hostId);
  const user = await User.findOne({ _id: userId });
   console.log(user.host);
   const result = await User.updateOne(
    { _id: new ObjectId(userId) }, // Match the user by its ID
    { $pull: { host: { host_id: new ObjectId(hostId) } } } // Pull the host object using its ID
  );
// console.log(updatedUser)
    res.status(200).json({ message: 'Host object deleted successfully' });
})
app.get("/demo", async (req, res) => {
  const docs = await User.find({});
  res.json(docs);
})

app.listen(process.env.P_PORT || 1000, () => {
  console.log("Running on port " + process.env.P_PORT);
})