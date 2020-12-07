const express = require("express");
const router = express.Router();

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
    let type = req.body.type //1: public, 2: Private, 3: Friends-Only
    if(!userId){
        console.log("UNDEFINED")
        return
    }
    const user = await User.findById(userId)
    if(!user){
        res.sendStatus(500)
        return
    }
    if(type === "1"){
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
                type: "public",
                board: initBoard(),
                gameOver: false,
                forfeited: false,
                currentPlayer: userId,
                winner: null,
                numTurns: 0,
                playerOne: userId,
                playerTwo: inQueue.public._id,
                active: true
            })
            waitingPlayerId.public = {playerId: inQueue.public._id, gameId: newGame._id}
            newGame.save().then(game => {
                // res.json(game)
            }).catch(err=>console.log(err))
            inQueue.public = null
            res.send({game: newGame._id})
            return
        }
        inQueue.public = user
        res.send({inQueue: true})
        return
    }else if(type === "2"){
        if(waitingPlayerId.private && userId === waitingPlayerId.private.playerId.toString()){
            res.send({game: waitingPlayerId.private.gameId})
            waitingPlayerId.private = null
            return
        }
        if(inQueue.private && inQueue.private._id.toString() === userId){
            res.send({inQueue: true})
            return
        }
        if(inQueue.private && inQueue.private._id.toString() !== userId){
            const newGame = await new Game({
                type: "private",
                board: initBoard(),
                gameOver: false,
                forfeited: false,
                currentPlayer: userId,
                winner: null,
                numTurns: 0,
                playerOne: userId,
                playerTwo: inQueue.private._id,
                active: true
            })
            waitingPlayerId.private = {playerId: inQueue.private._id, gameId: newGame._id}
            newGame.save().then(game => {
                // res.json(game)
            }).catch(err=>console.log(err))
            inQueue.private = null
            res.send({game: newGame._id})
            return
        }
        inQueue.private = user
        res.send({inQueue: true})
        return
    }else{
        if(waitingPlayerId.friends && userId === waitingPlayerId.friends.playerId.toString()){
            res.send({game: waitingPlayerId.friends.gameId})
            waitingPlayerId.friends = null
            return
        }
        if(inQueue.friends && inQueue.friends._id.toString() === userId){
            res.send({inQueue: true})
            return
        }
        if(inQueue.friends && inQueue.friends._id.toString() !== userId){
            const newGame = await new Game({
                type: "friends",
                board: initBoard(),
                gameOver: false,
                forfeited: false,
                currentPlayer: userId,
                winner: null,
                numTurns: 0,
                playerOne: userId,
                playerTwo: inQueue.friends._id,
                active: true
            })
            waitingPlayerId.friends = {playerId: inQueue.friends._id, gameId: newGame._id}
            newGame.save().then(game => {
                // res.json(game)
            }).catch(err=>console.log(err))
            inQueue.friends = null
            res.send({game: newGame._id})
            return
        }
        inQueue.friends = user
        res.send({inQueue: true})
    }
    
})

router.get('/:id', async (req, res) => {
    let gameId = req.params.id
    const game = await Game.findById(gameId)
    if(!gameId || !game){
        res.status(404).send()
        return
    }
    res.send({...game._doc, player1: (await User.findById(game.playerOne)), player2: (await User.findById(game.playerTwo))})
})

router.get('/activeGames/:id', async (req, res) => {
    let userId = req.params.id
    const user = await User.findById(userId)
    if(!userId || !user){
        res.status(404).send()
        return
    }
    let games = []
    for (let game of user.activeGames){
        games.push(await Game.findById(game))
    }
    res.send(games)
})

router.get('/allGames/:id', async (req, res) => {
    let userId = req.params.id
    const user = await User.findById(userId)
    if(!userId || !user){
        res.status(404).send()
        return
    }
    let games = []
    for (let game of user.gamesPlayed){
        const game1 = (await Game.findById(game))
        const player1 = await User.findById(game1.playerOne)
        const player2 = await User.findById(game1.playerTwo)
        games.push({...game1, player1, player2})
    }
    res.send(games)
})

//To match RESTful API
router.get('/', async (req, res) => {
    let player = req.query.player;
    let active = req.query.active;
    let detail = req.query.detail;

    if(!player){
        if(active === 'true'){
            if(detail === 'full'){
                await Game.find({
                    active: true
                }, (err, games) => {
                    if(err){
                        console.log("ERROR")
                        console.log(err)
                        res.setHeader("Content-Type", "application/json")
                        res.sendStatus(404)
                    }else{
                        let returnValue = games.map(game => {
                            return {player1: game.playerOne, player2: game.playerTwo, active: true, turns: game.turns}
                        })
                        res.send(returnValue)
                    }
                })
            }
            else{
                await Game.find({
                    active: true
                }, (err, games) => {
                    if(err){
                        console.log(err)
                        res.setHeader("Content-Type", "application/json")
                        res.sendStatus(404)
                    }else{
                        let returnValue = games.map(game => {
                            return {player1: game.playerOne, player2: game.playerTwo, active: true}
                        })
                        res.send(returnValue)
                    }
                })
            }
        }
        else{
            if(detail === 'full'){
                await Game.find({
                    active: false
                }, (err, games) => {
                    if(err){
                        console.log(err)
                        res.setHeader("Content-Type", "application/json")
                        res.sendStatus(404)
                    }else{
                        let returnValue = games.map(game => {
                            return {player1: game.playerOne, player2: game.playerTwo, active: false, winner: game.winner, numTurns: game.numTurns, forfeited: game.forfeited, turns: game.turns}
                        })
                        res.send(returnValue)
                    }
                })
            }else{
                await Game.find({
                    active: false
                }, (err, games) => {
                    if(err){
                        console.log(err)
                        res.setHeader("Content-Type", "application/json")
                        res.sendStatus(404)
                    }else{
                        let returnValue = games.map(game => {
                            return {player1: game.playerOne, player2: game.playerTwo, active: false, winner: game.winner, numTurns: game.numTurns, forfeited: game.forfeited}
                        })
                        res.send(returnValue)
                    }
                })
            }
        }
    }
    else{
        if(active === true){
            if(detail === 'full'){
                await Game.find({
                    active: true
                }, async (err, games) => {
                    if(err){
                        console.log(err)
                        res.setHeader("Content-Type", "application/json")
                        res.sendStatus(404)
                    }else{
                        let finalGames = []
                        for(let game of games){
                            let user1 = await User.findById(game.playerOne)
                            let user2 = await User.findById(game.playerTwo)
                            if(player.toLowerCase() === user1.username.toLowerCase() || player.toLowerCase() === user2.username.toLowerCase()){
                                finalGames.push(game)
                            }
                        }
                        let returnValue = finalGames.map(game => {
                            return {player1: game.playerOne, player2: game.playerTwo, active: true, winner: game.winner, numTurns: game.numTurns, forfeited: game.forfeited, turns: game.turns}
                        })
                        res.send(returnValue)
                    }
                })
            }else{
                await Game.find({
                    active: true
                }, async (err, games) => {
                    if(err){
                        console.log(err)
                        res.setHeader("Content-Type", "application/json")
                        res.sendStatus(404)
                    }else{
                        let finalGames = []
                        for(let game of games){
                            let user1 = await User.findById(game.playerOne)
                            let user2 = await User.findById(game.playerTwo)
                            if(player.toLowerCase() === user1.username.toLowerCase() || player.toLowerCase() === user2.username.toLowerCase()){
                                finalGames.push(game)
                            }
                        }
                        let returnValue = finalGames.map(game => {
                            return {player1: game.playerOne, player2: game.playerTwo, active: true, winner: game.winner, numTurns: game.numTurns, forfeited: game.forfeited}
                        })
                        res.send(returnValue)
                    }
                })
            }
        }else{
            if(detail === 'full'){
                await Game.find({
                    active: false
                }, async (err, games) => {
                    if(err){
                        console.log(err)
                        res.setHeader("Content-Type", "application/json")
                        res.sendStatus(404)
                    }else{
                        let finalGames = []
                        for(let game of games){
                            let user1 = await User.findById(game.playerOne)
                            let user2 = await User.findById(game.playerTwo)
                            if(player.toLowerCase() === user1.username.toLowerCase() || player.toLowerCase() === user2.username.toLowerCase()){
                                finalGames.push(game)
                            }
                        }
                        let returnValue = finalGames.map(game => {
                            return {player1: game.playerOne, player2: game.playerTwo, active: false, winner: game.winner, numTurns: game.numTurns, forfeited: game.forfeited, turns: game.turns}
                        })
                        res.send(returnValue)
                    }
                })
            }else{
                await Game.find({
                    active: false
                }, async (err, games) => {
                    if(err){
                        console.log(err)
                        res.setHeader("Content-Type", "application/json")
                        res.sendStatus(404)
                    }else{
                        let finalGames = []
                        for(let game of games){
                            let user1 = await User.findById(game.playerOne)
                            let user2 = await User.findById(game.playerTwo)
                            if(player.toLowerCase() === user1.username.toLowerCase() || player.toLowerCase() === user2.username.toLowerCase()){
                                finalGames.push(game)
                            }
                        }
                        let returnValue = finalGames.map(game => {
                            return {player1: game.playerOne, player2: game.playerTwo, active: false, winner: game.winner, numTurns: game.numTurns, forfeited: game.forfeited}
                        })
                        res.send(returnValue)
                    }
                })
            }
        }
    }
}
)




module.exports = router;
