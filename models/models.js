const {
  userSchema,
  workoutHistorySchema,
  workoutSchema,
  routineSchema,
  messageSchema,
} = require("../schemas/schemas");
const mongoose = require("../db/connect");

const User = mongoose.model("User", userSchema);
const WorkoutHistory = mongoose.model("WorkoutHistory", workoutHistorySchema);
const Workout = mongoose.model("Workout", workoutSchema);
const Routine = mongoose.model("Routine", routineSchema);
const Message = mongoose.model("Message", messageSchema);

// *************** USER *************** //

const createAndSaveUser = async (username, password) => {
  const newUser = new User({
    username: username,
    password: password,
    friends: [],
    requests: [],
  });

  const userExists = await findUserByUsername(username);
  if (userExists.length) {
    throw new Error("user exists");
  }

  try {
    const res = await newUser.save();
    return res;
  } catch (error) {
    throw error;
  }
};

const findUserByUsername = async (username, viewingAsFriend) => {
  let selectString = "-password";

  if (viewingAsFriend) selectString += " -messages ";

  try {
    const userToFind = await User.find({ username: username })
      .select(selectString)
      .exec();
    console.log("user found");
    return userToFind;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const validateUserDetails = async (username, password) => {
  try {
    const validUser = await User.find({ username: username });
    if (!validUser.length) {
      throw new Error("wrong username");
    } else if (validUser[0].password !== password) {
      throw new Error("wrong password");
    }

    return validUser;
  } catch (error) {
    throw error;
  }
};

const saveFriendRequest = async (data, requesteeUsername) => {
  try {
    const requestee = await User.find({ username: requesteeUsername }).exec();
    const requestor = await User.find({ username: data.username }).exec();
    requestor[0].pending.push({
      username: requesteeUsername,
      picture: requestee[0].picture,
    });
    requestee[0].requests.push(data);
    const saveRequestee = await requestee[0].save();
    const saveRequestor = await requestor[0].save();
    return saveRequestee;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const saveFriendAndRemoveRequest = async (
  requesteeUsername,
  requestorUsername
) => {
  try {
    const requestee = await findUserByUsername(requesteeUsername);
    const requestor = await findUserByUsername(requestorUsername);

    const indexToRemoveRequestee = requestee[0].requests.findIndex((el) => {
      return requestorUsername === el;
    });

    const indexToRemoveRequestor = requestor[0].pending.findIndex((el) => {
      return requesteeUsername === el.username;
    });

    requestee[0].friends.push({
      username: requestor[0].username,
      picture: requestor[0].picture,
    });
    requestee[0].requests.splice(indexToRemoveRequestee, 1);

    requestor[0].friends.push({
      username: requestee[0].username,
      picture: requestee[0].picture,
    });
    requestor[0].pending.splice(indexToRemoveRequestor, 1);

    const saveRequestee = await requestee[0].save();
    const saveRequestor = await requestor[0].save();

    return [saveRequestee, saveRequestor];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addMessageAndSave = async (
  receiverUsername,
  date,
  senderUsername,
  messageText
) => {
  const to = await User.find({ username: receiverUsername });
  if (!to) throw new Error("user does not exist");

  const messageToSave = new Message({
    from: senderUsername,
    to: receiverUsername,
    date: date,
    message: messageText,
  });

  try {
    const result = await messageToSave.save();
    console.log("message saved successfully");
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findUserMessages = async (username) => {
  try {
    const messages = await Message.find({
      $or: [{ from: username }, { to: username }],
    })
      .sort({ date: "desc" })
      .exec();
    console.log(messages);
    return messages;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// *************** WORKOUT HISTORY *************** //

const findWorkoutHistory = async (username, order, limit) => {
  if (!username) throw new Error("no username provided");

  let query = WorkoutHistory.find({ username: username });

  if (order) {
    query = query.sort({ date: order });
  }

  if (limit) {
    query = query.limit(parseInt(limit));
  }

  try {
    const workouts = await query.exec();
    return workouts;
  } catch (error) {
    throw error;
  }
};

const updateWorkoutHistory = async (data) => {
  try {
    const findRoutine = await Routine.find({
      username: data.username,
      routineName: data.routineName,
    });
    const workoutName = data.workoutName;
    const routine = findRoutine[0];
    console.log(data);
    console.log(findRoutine);
    const routineWorkouts = routine.workouts;
    const lastIndex = routineWorkouts.length - 1;
    const workoutIndexInRoutine = routineWorkouts.findIndex((el) => {
      return el.workoutName === workoutName;
    });
    const nextWorkoutIndex = workoutIndexInRoutine + 1;
    if (nextWorkoutIndex > lastIndex) {
      routine.nextWorkout = routine.workouts[0].workoutName;
    } else {
      routine.nextWorkout = routine.workouts[nextWorkoutIndex].workoutName;
    }
    const newWorkout = new WorkoutHistory(data);
    await newWorkout.save();
    await routine.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// *************** WORKOUTS *************** //

const removeAllUserWorkouts = async (username) => {
  try {
    const remove = await WorkoutHistory.deleteMany({ username: username });
    return remove;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createAndSaveWorkout = async (data) => {
  const newWorkout = new Workout(data);
  try {
    const res = await newWorkout.save();
    return res;
  } catch (error) {
    throw error;
  }
};

const findWorkouts = async (username) => {
  try {
    const res = await Workout.find({ username: username });
    return res;
  } catch (error) {
    throw error;
  }
};

const findNextWorkout = async (username) => {
  try {
    const findRoutine = await Routine.find({
      username: username,
      current: true,
    });
    const currentRoutine = findRoutine[0];
    const nextWorkoutInRoutine = currentRoutine.nextWorkout;
    const nextWorkout = await Workout.find({
      username: username,
      workoutName: nextWorkoutInRoutine,
    });
    console.log("next workout found -->", nextWorkout[0]);
    console.log("from routine -->", currentRoutine.routineName);
    return { routine: currentRoutine.routineName, workout: nextWorkout[0] };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// *************** ROUTINES *************** //

const createAndSaveRoutine = async (data) => {
  const newRoutine = new Routine(data);

  try {
    const findCurrent = await Routine.find({
      current: true,
      username: data.username,
    });
    const currentDefault = findCurrent[0];

    if (!currentDefault) {
      console.log(
        "setting as default as it is the first routine for this user"
      );
      newRoutine.current = true;
    } else if (newRoutine.current) {
      console.log("replacing current default routine with new default");
      currentDefault.current = false;
      await currentDefault.save();
    }

    const res = await newRoutine.save();
    console.log("new routine saved succesfully");
    return res;
  } catch (error) {
    console.error(error);
  }
};

const findRoutine = async (username) => {
  try {
    const res = await Routine.find({ username: username });
    return res;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAndSaveUser,
  findUserByUsername,
  validateUserDetails,
  findWorkoutHistory,
  updateWorkoutHistory,
  removeAllUserWorkouts,
  createAndSaveWorkout,
  findWorkouts,
  createAndSaveRoutine,
  findRoutine,
  saveFriendRequest,
  saveFriendAndRemoveRequest,
  addMessageAndSave,
  findUserMessages,
  findNextWorkout,
};
