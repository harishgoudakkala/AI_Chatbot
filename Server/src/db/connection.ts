import {connect, disconnect } from "mongoose"

async function connectToDatabase() {
    try{
        await connect(process.env.MONGODB_URL);
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