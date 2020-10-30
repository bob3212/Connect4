const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const passport = require("passport");
const cors = require('cors')
const app = express();

const http = require("http").createServer(app)
const io = require('socket.io')(http)

const users = require("./routes/users")


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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', socket => {
  socket.join(socket.request._query.game)
  socket.on('message', msg => {
    console.log(`Socket room: ${Object.keys(socket.rooms)[0]}`)
    io.to(Object.keys(socket.rooms)[0]).emit('message', msg)
  })
})

http.listen(8080, () => {
  console.log(`Example app listening at http://localhost:8080`)
})