JSX Files:
Board.jsx - JSX file which has the actual Connect4 game logic (The game doesn't work yet)
Chat.jsx - JSX file for the eventual chat system
Dashboard.jsx - JSX file for the dashboard that the user will see after logging in
FriendsList.jsx - JSX file for the eventual friends list system
Games.jsx - JSX file for the page showing all of the user's active games
Home.jsx - JSX file for the initial page when starting the website, take you to login/signup page
Login.jsx - JSX file for the frontend side of the Login page 
Profile.jsx - JSX file for the evental profile page of the user
Row.jsx - JSX file for each individual row in the connect4 game (going to change this because my current connect4 logic doesn't work)
Search.jsx - JSX file for searching for other users
Signup.jsx - JSX file for the frontend side of teh Sign up page
Unit.jsx -JSX file for each individual unit in the connect4 game (going to change)
PrivateRoute - JSX file for creating private routes which will be used to hide routes when the user is not logged in

JS Files:
keys.js - getting the mongo uri for the database (mainly for easier access to the database in the future)
passport.js - set up passport (strategy for authenticating json web tokens)
User.js - defining user schema
users.js - post for signup and login after validating login and signup withing login.js and signup.js
authAction.js - Uses axios to make HTTPRequests for actions (For react redux)
types.js - types of actions with React Components (For react redux)
authReducer.js - respond with new state based on the action (For react redux)
errorReducer.js - if there is an action which causes an errorReducer (For react redux)
index.js (in reducers) - combines authReducer and errorReducer into a singular rootReducer (For react redux)
setAuthToken.js - Set and delete the Authorization header for axios requests if users are logged in (or not) (For react redux)
App.js - Root component of the App
index.js - entrypoint is index.js which references the app.js component
store.js - create redux store that holds the complete state tree of this app
login.js - Validate the input for the login, returns any errors and an isValid boolean
signup.js - Validate the input for the register, returns any errors and an isValid boolean
server.js - The server for this app, uses express, pulls in the MongoURI from keys.js and connect to MongoDB, set up the port, the posting in there is for testing\


Project: Connect4
Working Solo

To install and start:
1. run npm install
2. npm run start
3. in another terminal, npm run server
4. for mongodb, follow the instructions here: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/? (I'm not sure how you would be able to see my mongo atlas)

For the additional functionality the TA should consider, I was able to get my backend working with my MongoDB. I used Mongo atlas and used postman to test the routes (successful).
I am also pretty close to getting my Connect4 game working, I just haven't beena able to figure out how to use the frontend with the logic. I have all of my basic 
pages except for the dashboard which will just be a central hub to go to the other components like active games or profiles. I'm trying to get my frontend to work with my backend
and my database right now which is why the login and signup is not working as it should. In order to get to the other parts of the website, please
use the Navbar at the top of the screen to look at the active games, profile page, and what the board would look like. (It works if I put an href on the submit button to /games or whatever)

Here is a google doc to show my database and backend working: https://docs.google.com/document/d/1SsG9crgMaOpx_H0EXx4AkcQwisMDQSYEJ1NFz-RTQME/edit?usp=sharing 