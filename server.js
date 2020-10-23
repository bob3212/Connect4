const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const passport = require("passport");
const cors = require('cors')

const users = require("./routes/users")

const app = express();


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

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.post('/login', function (req, res) {
//   console.log(req.body);
//   return res.send("<meta http-equiv = \"refresh\" content = \"0; url = /games\"/>")
// })

// app.post('/signup', function (req, res) {
//   console.log(req.body);
//   return res.send("<meta http-equiv = \"refresh\" content = \"0; url = /games\"/>")
// })

app.listen(8080, () => {
  console.log(`Example app listening at http://localhost:8080`)
})