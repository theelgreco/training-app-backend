const {
  createAndSaveUser,
  validateUserDetails,
  findWorkoutHistory,
  updateWorkoutHistory,
  removeAllUserWorkouts,
  createAndSaveWorkout,
  findWorkouts,
  createAndSaveRoutine,
  findRoutine,
  findUserByUsername,
  saveFriendRequest,
  saveFriendAndRemoveRequest,
  addMessageAndSave,
  findUserMessages,
} = require("../models/models");

exports.createLogin = async (req, res) => {
  const { username, password } = req.query;

  try {
    const result = await createAndSaveUser(username, password);
    console.log(result);
    res.status(200).send({ msg: "user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "something went wrong" });
  }
};

exports.getLogin = async (req, res) => {
  const { username, password } = req.query;
  try {
    const result = await validateUserDetails(username, password);
    res.status(200).send({ msg: "login successful" });
  } catch (error) {
    console.error(error);
    res.status(404).send({ msg: "details not found" });
  }
};

exports.getProfile = async (req, res) => {
  const { username } = req.query;

  try {
    const result = await findUserByUsername(username);
    console.log("success");
    res.status(200).send({ profile: result });
  } catch (error) {
    res.status(400).send({ msg: "user doesn't exist" });
  }
};

exports.viewProfileAsFriend = async (req, res) => {
  const { username } = req.query;

  try {
    const result = await findUserByUsername(username, true);
    console.log("success");
    res.status(200).send({ profile: result });
  } catch (error) {
    res.status(400).send({ msg: "user doesn't exist" });
  }
};

exports.getWorkoutHistory = async (req, res) => {
  const { username, order, limit } = req.query;

  try {
    const result = await findWorkoutHistory(username, order, limit);
    console.log(result);
    res.status(200).send({ workouts: result });
  } catch (error) {
    console.dir(error.message);
    res.status(404).send({ msg: "workout history not found" });
  }
};

exports.postWorkoutHistory = async (req, res) => {
  const data = req.body;

  console.log(req.body);

  try {
    const result = await updateWorkoutHistory(data);
    console.log("done");
    res.status(200).send({ msg: "success" });
  } catch (error) {
    res.status(400).send({ msg: "bad request" });
  }
};

exports.deleteAllWorkouts = async (req, res) => {
  const { username } = req.query;

  try {
    await removeAllUserWorkouts(username);
    console.log("deleted");
    res.status(200).send({ msg: "all workouts removed" });
  } catch (error) {
    res.status(400).send({ msg: "bad request" });
  }
};

exports.postWorkout = async (req, res) => {
  const data = req.body;

  try {
    await createAndSaveWorkout(data);
    console.log("workout uploaded");
    res.status(200).send({ msg: "uploaded workout successfully" });
  } catch (error) {
    res.status(400).send({ msg: "bad request" });
  }
};

exports.getWorkouts = async (req, res) => {
  const { username } = req.query;

  try {
    const result = await findWorkouts(username);
    res.status(200).send({ workouts: result });
  } catch (error) {
    res.status(404).send({ msg: "no workouts found" });
  }
};

exports.postRoutine = async (req, res) => {
  const data = req.body;

  try {
    const result = await createAndSaveRoutine(data);
    console.log("routine created successfully");
    res.status(200).send({ msg: "routine created successfully" });
  } catch (error) {
    res.status(400).send({ msg: "bad request" });
  }
};

exports.getRoutine = async (req, res) => {
  const { username } = req.query;

  try {
    const result = await findRoutine(username);
    res.status(200).send({ routines: result });
  } catch (error) {
    res.status(404).send({ msg: "can't find any routines for that user" });
  }
};

exports.postFriendRequest = async (req, res) => {
  const { username, profile } = req.body;

  try {
    const result = await saveFriendRequest(profile, username);
    console.log("sent request");
    res.status(200).send({ msg: "friend request sent" });
  } catch (error) {
    res.status(404).send({ msg: "user not found" });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const { requestee, requestor } = req.body;

  try {
    const result = await saveFriendAndRemoveRequest(requestee, requestor);
    console.log("friends have been made");
    res.status(200).send({ msg: "you are now friends" });
  } catch (error) {
    res.status(400).send({ msg: "something went wrong" });
  }
};

exports.postMessage = async (req, res) => {
  const { user } = req.params;
  const { date, from, message } = req.body;

  try {
    await addMessageAndSave(user, date, from, message);
    console.log("message sent successfully");
    res.status(200).send({ msg: "message sent" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ msg: "error occurred while sending message" });
  }
};

exports.getMessages = async (req, res) => {
  const { user } = req.params;
  console.log(user);
  try {
    const result = await findUserMessages(user);
    console.log("messages found");
    res.status(200).send({ messages: result });
  } catch (error) {
    console.error(error);
  }
};
