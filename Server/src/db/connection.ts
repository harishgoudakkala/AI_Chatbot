import {connect, disconnect } from "mongoose"

async function connectToDatabase() {
    try{
        const mongoUrl = process.env.MONGODB_URL;

        if (!mongoUrl) {
            throw new Error("MONGODB_URL is not defined");
        }

        await connect(mongoUrl);
        console.log('Connected to MongoDB');
    }catch(err){
        console.log(err);
        throw new Error("Could not connect to MongoDB")
    }
}

async function disconnectFromDatabase() {
    try{
        await disconnect();
        console.log('Disconnected from MongoDB');
    }catch(err){
        console.log(err);
        throw new Error("Could not disconnect from MongoDB")
    }
    
}

export { connectToDatabase, disconnectFromDatabase }