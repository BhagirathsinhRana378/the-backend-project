import mongoose from "mongoose";

import {DB_NAME} from "../constants.js";

const connectDB = async () => {
    // Connect to MongoDB
    //here we use async await to make sure that the connection is established before proceeding further
    try {
        const connectionInstance =
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongoDB connected: ${connectionInstance.connection.host}`)
        // eslint-disable-next-line no-unreachable
        // eslint-disable-next-line no-unreachable

    } catch (error) {
        console.error("Error connecting to the mongoDB database:", error);
        process.exit(1);

    }
}


/*-- practicing the connection code
const dbconnection = async() => {
    try {
        const = mainConnection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`mongodb connected: ${mainConnection.connection.host}`)
    } catch (error) {
        console.log(`failed to connect your db:`,error);
        process.exit(1)
    }
}
*/



export default connectDB;


