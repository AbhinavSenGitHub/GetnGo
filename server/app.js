require("dotenv").config();
const express = require("express");
const User = require("./mongo");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieSession = require("cookie-session");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const multer = require("multer");
const path = require("path");
const passportSetup = require("./passport");
// const authRoutes = require("./routes/auth");
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
app.use(passport.initialize());
app.use(passport.session());

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

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
let userID = "";
let userNAME = "";
app.post("/api/signin", async (req, res) => {
  const { username, password, number, concent } = req.body;
  userNAME = username;
  User.register(
    { username: username, number: number, concent: concent },
    password,
    (err, user) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          userID = user._id;
          // res.redirect("/posts");
        });
        res.json({ success: true, redirectUrl: "/carPost" });
      }
    }
  );
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  userNAME = username;
  req.login(
    {
      password: password,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfuly user login");
        res.json({ success: true, redirectUrl: "/carPost" });
      }
    }
  );
});
// passport.use(new LocalStrategy(
//   (username, password, done) => {
//       // Replace with your user authentication logic
//       if (username === 'user' && password === 'password') {
//           return done(null, { id: 1, username: 'user' });
//       } else {
//           return done(null, false, { message: 'Invalid credentials' });
//       }
//   }
// ));

// app.post("/api/login", (req, res) => {
//   // Redirect or send a success response
//   res.json({ success: true, redirectUrl: '/carPost' });
// });
// app.post('/login', passport.authenticate("local", {
//   successRedirect: "/profile",
//   failureRedirect: "/login"
// }), function (req, res, next) {
// });

app.get("/api/logout", (req, res, next) => {
  req.logout();
  req.session = null; // Clear the session data
  console.log("User logged out successfully"); // Log the message
  res.status(200).end();
  userNAME = null;
});

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
  // const imagePath = req.file.path;
  let imagePath = [];
  for (let i = 0; i < req.files.length; i++) {
    const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
      req.files[i].path,
      {
        folder: "getngo",
        fetch_format: "webp",
      }
    );
    // console.log(secure_url, public_id)
    imagePath.push({ secure_url, public_id });
  }

  const userHost = {
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
  };
  console.log("login_id compose:- " + req.user._id);
  User.updateOne({ username: userNAME }, { $push: { host: userHost } })
    .then(() => {
      console.log("Post insert Successful");
      res.json({ success: true, redirectUrl: "/carPost" });
    })
    .catch((err) => {
      console.log("Error :- ", err);
    });
  res.json(userHost)

});

app.get("/demo", async (req, res) => {
  const docs = await User.find({});
  res.json(docs);
});
app.get("/api/authenticated", (req, res) => {
  console.log("req for check" + req.isAuthenticated());
  res.json({ authenticated: req.isAuthenticated() });
});

// app.get("/profile", async (req, res) => {
//   const docs = await User.findById(req.user._id);
//   console.log(docs)
// });
// res.json(docs)

// .then((foundUser) => {
//   console.log(foundUser.userPost);
//   const username = foundUser.username;
//   const userArray = foundUser.userPost;
//   res.render("activities", {username: username, userPost: userArray});
// })
// .catch((error) => {
//     console.error('Error retrieving post:', error);
//     res.status(500).send('Error retrieving post');
//   });

app.listen(1234, () => {
  console.log("Running on port 1234");
});



// app.post("/api/host", upload.array("image", 16), async (req, res) => {
//   const {
//     vehicle,
//     company,
//     name,
//     fuleType,
//     registrationYear,
//     transmissionType,
//     seats,
//     fastag,
//     kmDriven,
//     cityName,
//     feedback,
//     price,
//   } = req.body;
//   // const imagePath = req.file.path;
//   let imagePath = [];
//   for (let i = 0; i < req.files.length; i++) {
//     const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
//       req.files[i].path,
//       {
//         folder: "getngo",
//         fetch_format: "webp",
//       }
//     );
//     // console.log(secure_url, public_id)
//     imagePath.push({ secure_url, public_id });
//   }

//   const userHost = {
//     image: imagePath,
//     vehicle,
//     company,
//     name,
//     fuleType,
//     registrationYear,
//     transmissionType,
//     seats,
//     fastag,
//     kmDriven,
//     cityName,
//     feedback,
//     price,
//   };

//   console.log("login_id compose:- " + userID);
//   // res.json({ success: true, redirectUrl: '/carPost' });
//   User.updateOne({ username: userNAME }, { $push: { host: userHost } })
//     .then(() => {
//       console.log("Post insert Successful");
//       res.json({ success: true, redirectUrl: "/carPost" });
//     })
//     .catch((err) => {
//       console.log("Error :- ", err);
//     });
//   // res.json(userHost)
// });