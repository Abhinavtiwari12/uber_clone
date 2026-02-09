import { User } from "../models/user.model.js";



export const findUser = async (condition) => {
  const user = await User.findOne(condition);

  if (!user) {
    return {
      success: false,
      message: "No user exist with this detail",
      data: null,
    };
  }

  return {
    success: true,
    message: "User already exists",
    data: user,
  };
};

export const registerUser = async (createUser) => {
  const user = await User.create(createUser);

  if (!user) {
    return {
      success: false,
      message: "User not created",
      data: null,
    };
  }

  return {
    success: true,
    message: "User created successfully",
    data: user,
  };
};

