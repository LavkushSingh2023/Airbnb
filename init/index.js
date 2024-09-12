const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("./models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL  || "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(err))

async function main() {
    await mongoose.connect(MONGO_URL);
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
