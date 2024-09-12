const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("./models/listing.js");
require('dotenv').config();

console.log("Database URL from .env file:", process.env.ATLASDB_URL);

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;  // Use local DB as fallback for development  // of shradha

main()
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(err))

async function main() {
    await mongoose.connect(dbURL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: '66b5a452f894b45db0df632a'
}));
    await Listing.insertMany(initData.data);
   // await Listing.updateMany({}, {$unset: {'image.filename': 1}});
    console.log("data is inserted")
}

initDB()

