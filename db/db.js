const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });