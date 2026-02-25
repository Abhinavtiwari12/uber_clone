import { Driver } from "../models/driver.model.js";


export const findDriver = async (condition) => {
  const drivers = await Driver.findOne(condition);

  if (!drivers) {
    return {
      success: false,
      message: "No user exist with this detail",
      data: null,
    };
  }

  return {
    success: true,
    message: "User already exists",
    data: drivers,
  };
};



export const registerDriver = async (createUser) => {
  const drivers = await Driver.create(createUser);

  if (!drivers) {
    return {
      success: false,
      message: "User not created",
      data: null,
    };
  }

  return {
    success: true,
    message: "User created successfully",
    data: drivers,
  };
};