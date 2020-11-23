Project: Connect4
Working Solo

Extensions:
-Using Database
-Local MongoDB working on OpenStack
-React

Design Decisions:
-Used react for fast, scalable, and simple website
-Used passportjs for authentication
-Used mongodb for scalability
-Used axios because it's simlpy and easy to customize and provides support for request and response interceptors, transformers and auto-conversion to JSON
-Used bootstrap for responsive css that is adjustable for different devices
-Additional RESTful API routes for greater flexibility
-Database has 2 separate collections: 1 for users, 1 for games
-Used mongoose for schema validation and translating data betwen objects in code and the representation of those objects in mongoDB

Openstack instance information:
-Public address: 134.117.128.7
-username: davidyu, password: Micky0012

Instructions:
1. Open 4 terminals (1 for each tunneling for frontend, 1 for backend, 1 for running the server, 1 for starting the frontend)
2. In terminal 1, type in ssh -L 3000:localhost:3000 student@134.117.128.7 and type in Micky0012 for the password (for tunneling to frontend)
3. In terminal 2, type in ssh student@134.117.128.7 and type in Micky0012 for the password
4. In terminal 3, type in ssh -L 8080:localhost:8080 student@134.117.128.7 and type in Micky0012 for the password (for tunneling to backend)
5. In terminal 4, type in ssh student@134.117.128.7 and type in Micky0012 for the password
6. In terminal 2, cd in Connect4 and then type in npm install
7. Once the npm install finishes, in terminal 2, type in npm start
8. In terminal 4, cd in Connect4 and then type in node server.js
9. Once its finished starting, open localhost:3000 on browser and the website should work from there

(If you search for a game, any of the 3 options (public, private, friends only will all automatically be public right now (will be done for final)))
(If you try to add a friend through user profiles rather than the search, then the friend will automatically be friended on the User Profile page instead of needing to wait for a request (request will still be sent to the user) and then showing the remove friend)
(The RESTful API is not exactly the same as the specs but they have mostly the same functionality and will adjust to the specs for the final functionality)
(Only have public accounts and games working, private and friends-only will be implemented for final functionality)