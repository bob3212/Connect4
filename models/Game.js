const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
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
    },// ,
    // public: {
    //     type: Boolean,
    //     required: true
    // },
    date: {
        type: String,
        default: Date.now
    }
})

module.exports = mongoose.model("users", UserSchema);