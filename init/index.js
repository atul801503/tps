const mongoose = require("mongoose");
const intData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const updatedData = intData.data.map((obj) => ({
      ...obj,
      owner: "6788d611c6e235c21271dbd2",
    }));
    await Listing.insertMany(updatedData);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error during database initialization:", err);
  }
};

initDB();
