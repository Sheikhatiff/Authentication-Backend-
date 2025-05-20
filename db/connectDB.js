import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URI.replace("<pass>", process.env.DB_PASS).replace(
        "<user>",
        process.env.DB_USER
      )
    );
    console.log(`Database Connected Successfully !`);
  } catch (err) {
    console.log(`Database Connection Failed: ${err.message}`);
    process.exit(1);
  }
};
