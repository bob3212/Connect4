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
    },
    public: {
        type: Boolean
    },
    date: {
        type: String,
        default: Date.now
    },
    activeGames: {
        type: []
    },
    friends: {
        type: []
    },
    gamesPlayed: {
        type: []
    },
    online: {
        type: Boolean,
        default: true
    },
    numWins: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("users", UserSchema);