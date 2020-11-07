const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const authenticateJWT = require("./users")

// Load Game model
const Game = require("../models/Game");
const User = require("../models/User")

const initBoard = () => {
    let board=[];
    for(let row=0; row<6; row++){
        let row=[];
        for(let col=0; col<7; col++){
            row.push(null);
        }
        board.push(row);
    }
    return board
}

router.post('/create', (req, res) => {
    const newGame = new Game({
        public: true,
        board: initBoard(),
        gameOver: false,
        forfeited: false,
        currentPlayer: null,
        playerOne: 1,
        playerTwo: 2
    })
    newGame.save().then(game => res.json(game)).catch(err=>console.log(err))
})

module.exports = router;