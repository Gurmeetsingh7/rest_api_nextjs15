import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Database already connected");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting to database...");
    return;
  }

  try {
    mongoose.connect(DATABASE_URL!, {
      dbName: "rest_api_nextjs15",
      bufferCommands: true,
    });
    console.log("Database connected sucessfully");
  } catch (err: any) {
    console.log("Error", err);
    throw new Error("Error: ", err);
  }
};

export default connect;
