import userSchema from '../models/userModel.js'
import asyncHandler from 'express-async-handler';

export const verifyUserExist = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;

  const user = await userSchema.findOne({ _id: userId });

  if (!user)
    return res.status(404).json({ message: `User [${userId}] not found` });

  req.user = user;

  next();
});
