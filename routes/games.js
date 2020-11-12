const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const authenticateJWT = require("./users")

// Load Game model
const Game = require("../models/Game");
const User = require("../models/User")

let inQueue = {public: null, private: null, friends: null}
let waitingPlayerId = {public: null, private: null, friends: null}

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

router.post('/queue', async (req, res) => {
    let userId = req.body.id
    if(!userId){
        console.log("UNDEFINED")
        return
    }
    const user = await User.findById(userId)
    if(!user){
        res.sendStatus(500)
        return
    }
    if(waitingPlayerId.public && userId === waitingPlayerId.public.playerId.toString()){
        res.send({game: waitingPlayerId.public.gameId})
        waitingPlayerId.public = null
        return
    }
    if(inQueue.public && inQueue.public._id.toString() === userId){
        res.send({inQueue: true})
        return
    }
    if(inQueue.public && inQueue.public._id.toString() !== userId){
        const newGame = await new Game({
            public: true,
            board: initBoard(),
            gameOver: false,
            forfeited: false,
            currentPlayer: userId,
            winner: null,
            numTurns: 0,
            playerOne: userId,
            playerTwo: inQueue.public._id
        })
        waitingPlayerId.public = {playerId: inQueue.public._id, gameId: newGame._id}
        console.log("NEW GAME:" + newGame)
        newGame.save().then(game => {
            // res.json(game)
            console.log(game)
        }).catch(err=>console.log(err))
        inQueue.public = null
        res.send({game: newGame._id})
        return
    }
    inQueue.public = user
    res.send({inQueue: true})
    return
})

router.get('/:id', async (req, res) => {
    let gameId = req.params.id
    const game = await Game.findById(gameId)
    if(!gameId || !game){
        res.status(404).send()
        return
    }
    res.send({player1: (await User.findById(game.playerOne)), player2: (await User.findById(game.playerTwo))})
})

module.exports = router;