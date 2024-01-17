import mongoose from "mongoose";

async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
    } catch (error) {
        throw new Error("Unable to connect to database");
    }
}

export default dbConnect;
