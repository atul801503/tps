const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
  await Listing.deleteMany({});

  // Convert "owner" to ObjectId
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("6788d611c6e235c21271dbd2"), // Convert to ObjectId
  }));

  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDb();
