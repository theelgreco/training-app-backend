require("dotenv").config();

const {
  getLogin,
  createLogin,
  getWorkoutHistory,
  postWorkoutHistory,
  deleteAllWorkouts,
  postWorkout,
  getWorkouts,
  postRoutine,
  getRoutine,
  getProfile,
  postFriendRequest,
  acceptFriendRequest,
  viewProfileAsFriend,
  postMessage,
  getMessages,
} = require("./controllers/controllers");

const cors = require("cors");
const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("someone requested");
  const msg = Math.floor(Math.random() * 50);
  res.send(String(msg));
});

app.get("/api/login", getLogin);

app.post("/api/login", createLogin);

app.get("/api/profile", getProfile);

app.get("/api/view/profile", viewProfileAsFriend);

app.post("/api/request/send", postFriendRequest);

app.post("/api/request/accept", acceptFriendRequest);

app.get("/api/workouthistory", getWorkoutHistory);

app.post("/api/workouthistory", postWorkoutHistory);

app.delete("/api/workouthistory", deleteAllWorkouts);

app.get("/api/workouts", getWorkouts);

app.post("/api/workouts", postWorkout);

app.get("/api/routines", getRoutine);

app.post("/api/routines", postRoutine);

app.post("/api/:user/messages", postMessage);

app.get("/api/:user/messages", getMessages);

app.listen(PORT, () => {
  console.log("server is listening on port: " + PORT);
});
