const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }// ,
    // public: {
    //     type: Boolean,
    //     required: true
    // }
})

module.exports = mongoose.model("users", UserSchema);