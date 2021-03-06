const mongoose = require("mongoose");
const {User} = require("./User");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    type: {
        type: String
    },
    date: {
        type: String,
        default: Date.now
    },
    playerOne: {
        type: String
    },
    playerTwo: {
        type: String
    },
    winner: {
        type: String
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
        type: String
    },
    draw: {
        type: Boolean
    },
    spectators: {
        type: []
    },
    active: {
        type: Boolean
    }
})

module.exports = mongoose.model("games", GameSchema);