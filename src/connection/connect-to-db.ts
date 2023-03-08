import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    if (process.env.MONGO === undefined)
      throw new Error("Mongodb Url is undefined");
    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.MONGO);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};

export default connectToDb;
