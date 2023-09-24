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
const uuid = require('uuid');
// const authRoutes = require("./routes/auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';


const app = express();
const formidable = require("formidable");
const cloudinary = require("cloudinary");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/image", express.static(path.join(__dirname, "public")));

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
    console.log(token);
    // res.json({ token });
    res.status(200).json({ message: 'Login successful', success: true, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
})

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
      postID: uuid.v4(),
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
  console.log("token: " + token);
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

// app.get("/api/delete/:postId", authenticateJWT,  (req, res) => {
//   const userID = req.user.number
//   const postIdToDelete = req.params.postId
//   console.log(postIdToDelete)
//   const user = User.find({ number: userID }).populate('host') .exec()
//   if (postIdToDelete !== -1) {
//     // Remove the post object from the 'posts' array
//     console.log("user:- " + user.username)
//     // user.host.splice([postIdToDelete], 1);

//     // Save the updated user document
//     const updatedUser = user.save();
//     res.json(updatedUser);
//   } else {
//     console.log('Post not found');
//   }
  
//   // try {
//   //   const userPostss = await User.find({ number: user })
//   //   // const userPostss = await User.findOne({ 'host.postId': postIdToDelete})
//   //   console.log("userPosts for delete:- " + userPostss)
//   //   // console.log("host[index]" + userPostss.number)

//   //   // res.json(userPostss);
//   //   // res.status(200).json({ message: 'Post deleted successfully' });
//   // } catch (error) {
//   //   console.error('Error fetching user posts', error);
//   //   res.status(500).json({ message: 'Internal server error'});
//   // }
// })

app.get("/demo", async (req, res) => {
  const docs = await User.find({});
  res.json(docs);
})

app.listen(process.env.P_PORT || 1000, () => {
  console.log("Running on port " + process.env.P_PORT);
})