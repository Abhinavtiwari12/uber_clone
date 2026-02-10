import { driver } from "../models/driver.model";


export const findDriver = async (condition) => {
  const driver = await driver.findOne(condition);

  if (!driver) {
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



export const registerDriver = async (createUser) => {
  const driver = await driver.create(createUser);

  if (!driver) {
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