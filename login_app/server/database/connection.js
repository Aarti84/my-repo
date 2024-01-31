import mongoose from "mongoose"; 
//import ENV from '../config.js'

import { MongoMemoryServer } from "mongodb-memory-server"; // in memory server for practice

async function connect(){
    const mongod = await MongoMemoryServer.create();  // creates a new mongodb instance whenever you start your server
    const getUri = mongod.getUri();

    mongoose.set('strictQuery',true);

 // const db = await mongoose.connect(getUri);
   const db = await mongoose.connect(ENV.ATLAS_URI);
    console.log("Database Connected");
    return db;
}

export default connect;