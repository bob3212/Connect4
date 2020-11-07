const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const passport = require("passport");
const cors = require('cors')
const app = express();
const Game = require('./models/Game')

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
  for(let r=0; r<6; r++){
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
  for(let r=0; r<6; r++){
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
  return this.checkHorizontal(board) || this.checkVertical(board) || this.checkFirstDiagonal(board) || this.checkSecondDiagonal(board) || this.checkDraw(board)
}
const switchPlayer=(curPlayer, player1, player2)=>{
  return (curPlayer === player1) ? player2 : player1;
}

io.on('connection', async socket => {
  console.log("CONNECTED")
  socket.join(socket.request._query.game)
  let game = socket.request._query.game
  const game1 = await Game.findById(game)
  //console.log(game1)
  socket.emit('gameState', game1.board)
  //socket.emit('players', )

  socket.on('message', msg => {
    console.log(`Socket room: ${Object.keys(socket.rooms)[0]}`)
    io.to(getGame(socket)).emit('message', msg)
  })
  socket.on('move', async move => {
    let game9 = getGame(socket)
    const foundGame = await Game.findById(game9)
    console.log(foundGame)
    let board=foundGame.board
    let column=move.col
    let player1 = foundGame.playerOne
    let player2 = foundGame.playerTwo
    let currentPlayer = move.currentPlayer
    for(let i=5; i>=0; i--){
      if(board[i][column] === null){
        board[i][column] = currentPlayer;
        break;
      }
    }
    io.to(game9).emit('curPlayer', (currentPlayer === player1) ? player2 : player1)
    // let result = this.checkGameEnded(board)
    // if(result === null){
    //   move.currentPlayer = this.switchPlayer(move.currentPlayer, move.player1, move.player2)
    // }
    // io.to(game9).emit('curPlayer', )
    io.to(game9).emit('gameState', board)
    foundGame.board = [...board]
    foundGame.markModified("board")
    await foundGame.save()
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