const mongoose = require("mongoose");
const { Schema } = mongoose;

exports.userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  friends: { type: Array },
  requests: { type: Array },
  pending: { type: Array },
  messages: { type: Array },
  picture: {
    type: String,
    default: "https://i.scdn.co/image/ab67616d0000b273944a7c80c618de0e620ce04d",
  },
});

exports.routineSchema = new Schema({
  username: { type: String, required: true },
  routineName: { type: String, required: true },
  workouts: { type: Array, required: true },
  nextWorkout: { type: String },
  current: { type: Boolean },
});

exports.workoutSchema = new Schema({
  username: { type: String, required: true },
  workoutName: { type: String, required: true },
  exercises: { type: Array, required: true },
});

exports.workoutHistorySchema = new Schema({
  username: { type: String, required: true },
  date: { type: Date, required: true },
  workoutName: { type: String, required: true },
  routineName: { type: String, required: true },
  exercises: { type: Array, required: true },
});

exports.messageSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  message: { type: String, required: true },
});
