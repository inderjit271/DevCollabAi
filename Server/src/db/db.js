const mongoose = require('mongoose')
require("dotenv").config()

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Database connected successfully")
    }
    catch(error) {
        console.log("Database connection failed");
        console.error(error.message);
        process.exit(1)
    }
}

module.exports = connectDB