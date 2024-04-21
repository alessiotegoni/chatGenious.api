import asyncHandler from "express-async-handler";
import userSchema from '../models/userModel.js'

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userSchema.find().select("-password").lean().exec();

  res.json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { username } = req.user;

  const user = userSchema.findOne({ username });

  if (!user) return res.sendStatus(404);

  await user.deleteOne().exec();

  res.json({ message: `Account eliminato` });
});