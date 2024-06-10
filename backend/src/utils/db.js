const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')
const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("😀😀😀😀😀😀 Connected to Kanbans 😀😀😀😀😀😀😀😀😀😀😀😀😀😀");

    } catch (error) {
        console.log(error);
    }


}

module.exports = connectToMongo;

