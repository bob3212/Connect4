const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const passport = require("passport");
const cors = require('cors')
const app = express();
const Game = require('./models/Game')
const User = require('./models/User')
const http = require("http").createServer(app)
const io = require('socket.io')(http)

const users = require("./routes/users")
const games = require("./routes/games")
let gameID = 1;


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const db = require('./config/keys').mongoURI;

mongoose.connect(db, {useNewUrlParser: true}).then(()=>console.log("Successfully connected to mongodb")).catch(err=>console.log(err))

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(passport.initialize())
require("./config/passport")(passport)
app.use("/users", users);
app.use("/games", games)

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const getGame=socket=>{
  return Object.keys(socket.rooms)[1]
}
const checkHorizontal=board=>{
  for(let r=0; r<6; r++){
    for(let c=0; c<4; c++){
      if(board[r][c]){
        if(board[r][c] === board[r][c+1] && board[r][c] === board[r][c+2] && board[r][c] === board[r][c+3]){
          return board[r][c];
        }
      }
    }
  }
}
const checkVertical=board=>{
  for(let r=0; r<3; r++){
    for(let c=0; c<7; c++){
      if(board[r][c]){
        if(board[r][c] === board[r+1][c] && board[r][c] === board[r+2][c] && board[r][c] === board[r+3][c]){
          return board[r][c];
        }
      }
    }
  }
}
const checkFirstDiagonal=board=>{
  for(let r=0; r<3; r++){
    for(let c=0; c<4; c++){
      if(board[r][c]){
        if(board[r][c] === board[r+1][c+1] && board[r][c] === board[r+2][c+2] && board[r][c] === board[r+3][c+3]){
          return board[r][c];
        }
      }
    }
  }
}
const checkSecondDiagonal=board=>{
  for(let r=3; r<6; r++){
    for(let c=0; c<4; c++){
      if(board[r][c]){
        if(board[r][c] === board[r-1][c+1] && board[r][c] === board[r-2][c+2] && board[r][c] === board[r-3][c+3]){
          return board[r][c];
        }
      }
    }
  }
}
const checkDraw=board=>{
  for(let r=0; r<6; r++){
    for(let c=0; c<7; c++){
      if(!board[r][c]){
        return null;
      }
    }
  }
  return "draw"
}
const checkGameEnded=board=>{
  return checkHorizontal(board) || checkVertical(board) || checkFirstDiagonal(board) || checkSecondDiagonal(board) || checkDraw(board)
}

io.on('connection', async socket => {
  
  console.log("CONNECTED")
  socket.join(socket.request._query.game)
  let game = socket.request._query.game
  const game1 = await Game.findById(game)

  let u1 = await User.findById(game1.playerOne)
  let u2 = await User.findById(game1.playerTwo)
  await User.findByIdAndUpdate({_id: game1.playerOne}, {$addToSet: {activeGames: game1._id}})
  await User.findByIdAndUpdate({_id: game1.playerTwo}, {$addToSet: {activeGames: game1._id}})

  io.to(game1).emit('players', {player1: u1, player2: u2})

  socket.emit('gameState', game1.board)
  let initialValue = (game1.currentPlayer === u1) ? 1 : 2
  socket.emit('turn', initialValue)

  socket.on('message', msg => {
    console.log(`Socket room: ${Object.keys(socket.rooms)[0]}`)
    io.to(getGame(socket)).emit('message', msg)
  })
  socket.on('move', async move => {
    let game9 = getGame(socket)
    const foundGame = await Game.findById(game9)
    
    let board=foundGame.board
    let column=move.col
    let player1 = foundGame.playerOne
    let player2 = foundGame.playerTwo
    const user1 = await User.findById(player1)
    const user2 = await User.findById(player2)
    let currentPlayer = foundGame.currentPlayer
    let value = (currentPlayer === player1) ? 1 : 2
    if(value === move.currentPlayer || board[0][column] !== null){
      return
    }
    for(let i=5; i>=0; i--){
      if(board[i][column] === null){
        board[i][column] = value;
        break;
      }
    }
    let result = checkGameEnded(board)
    if(result === null){
      let nextPlayer = (currentPlayer === player1) ? player2 : player1
      io.to(game9).emit('gameState', board)
      io.to(game9).emit('turn', value)
      foundGame.currentPlayer = nextPlayer
      foundGame.board = board
      foundGame.markModified("board")
    }else if(result === 1){
      io.to(game9).emit('gameState', board)
      io.to(game9).emit('gameOver', {over: true, result: user2})
      foundGame.board = board
      foundGame.markModified("board")
      foundGame.winner = foundGame.playerTwo
      await User.findByIdAndUpdate({_id: game1.playerOne}, {$pull: {activeGames: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerTwo}, {$pull: {activeGames: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerOne}, {$addToSet: {gamesPlayed: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerTwo}, {$addToSet: {gamesPlayed: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerTwo}, {$inc: {numWins: 1}})
    }else if(result === 2){
      io.to(game9).emit('gameState', board)
      io.to(game9).emit('gameOver', {over: true, result: user1})
      foundGame.board = board
      foundGame.markModified("board")
      foundGame.winner = foundGame.playerOne
      await User.findByIdAndUpdate({_id: game1.playerOne}, {$pull: {activeGames: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerTwo}, {$pull: {activeGames: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerOne}, {$addToSet: {gamesPlayed: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerTwo}, {$addToSet: {gamesPlayed: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerOne}, {$inc: {numWins: 1}})
    }else{
      io.to(game9).emit('gameState', board)
      io.to(game9).emit('gameOver', {over: true, result: "draw"})
      await User.findByIdAndUpdate({_id: game1.playerOne}, {$pull: {activeGames: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerTwo}, {$pull: {activeGames: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerOne}, {$addToSet: {gamesPlayed: game1._id}})
      await User.findByIdAndUpdate({_id: game1.playerTwo}, {$addToSet: {gamesPlayed: game1._id}})
    }
    foundGame.numTurns += 1
    foundGame.turns.push(column)
    await foundGame.save()
    console.log(foundGame)
  })
  // socket.on('forfeit', forfeit => {
  //   io.to(getGame(socket)).emit('forfeit', forfeit)
  // })
  socket.on('disconnect', () => {
    console.log("User disconnected")
  })
})

http.listen(8080, () => {
  console.log(`Example app listening at http://localhost:8080`)
})