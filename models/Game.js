const mongoose = require("mongoose");
const {User} = require("./User");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    public: {
        type: Boolean,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    },
    playerOne: {
        type: mongoose.Schema.ObjectId
    },
    playerTwo: {
        type: mongoose.Schema.ObjectId
    },
    winner: {
        type: mongoose.Schema.ObjectId
    },
    active: {
        type: Boolean
    },
    detail: {
        type: String
    },
    numTurns: {
        type: Number
    },
    forfeited: {
        type: Boolean
    },
    turns: {
        type: []
    },
    board: {
        type: []
    },
    currentPlayer: {
        type: Number
    }
})

module.exports = mongoose.model("games", GameSchema);