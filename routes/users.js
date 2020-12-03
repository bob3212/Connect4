const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const keys = require("../config/keys")
const mongoose = require("mongoose")
const verify = require("../src/utilities/verifyToken")

// Load input validation
const validateSignupInput = require("../validate/signup");
const validateLoginInput = require("../validate/login");
// Load User model
const User = require("../models/User");

const authenticateJWT = (req, res, next) => {
    let jwtUser = jwt.verify(verify(req), keys.secretOrKey)
    if(jwtUser){
        req.name = jwtUser.name
        req.id = jwtUser.id
        next()
    }else{
        res.status(401).json({msg: "No authentication token"})
    }
}
module.exports = authenticateJWT

router.post("/signup", (req, res) => {
    const { errors, isValid } = validateSignupInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
    User.findOne({ username: req.body.username }).then(user => {
        if(user){
            return res.status(409).json({ username: "Username already exists!"})
        }else {
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                password: req.body.password
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err){
                        throw err;
                    }
                    newUser.password = hash;
                    newUser.save().then(user => res.json(user)).catch(err=>console.log(err));
                })
            })
        }
    })

})

router.post("/login", (req,res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username }).then(user => {
        if(!user){
            return res.status(404).json({ username: "Username not found!"})
        }
        bcrypt.compare(password, user.password).then(async isMatch => {
            if(isMatch){
                const payload = {
                    id: user.id,
                    name: user.name
                }
                await User.findByIdAndUpdate({_id: user._id}, {online: true})
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 1000000 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token,
                            name: user.name,
                            username: user.username,
                            userID: user._id, 
                            online: true
                        })
                    }
                )
            } else {
                return res.status(401).json({ passwordincorrect: "Password incorrect. Please try again."})
            }
        })
    })
})

router.post('/logout', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.body.id)
    if(!user){
        console.log("not found sadge")
        res.sendStatus(404)
        return
    }
    await User.findByIdAndUpdate({_id: user._id}, {online: false})
    // localStorage.removeItem("jwtToken")
})

//Get all users in database other than yourself
// router.get('/all', authenticateJWT, async (req, res) => {
//     try{
//         // let jwtUser = jwt.verify(verify(req), keys.secretOrKey)
//         // let id = mongoose.Types.ObjectId(jwtUser.id)
//         let user = await User.findById(req.user)
//         User.aggregate().match( {_id: {$not:{ $eq: user.id} } }).project({
//             password: 0,
//             __v: 0,
//             date: 0
//         }).exec((err, users) => {
//             if(err){
//                 console.log(err)
//                 res.setHeader("Content-Type", "application/json")
//                 res.end(JSON.stringify({message: "Failure"}))
//                 res.sendStatus(500)
//             }else{
//                 console.log(JSON.stringify(users))
//                 res.send(users)
//             }
//         })
//     }catch(err){
//         console.log(err)
//         res.setHeader("Content-Type", "application/json")
//         res.end(JSON.stringify({message: "Unauthorized"}))
//         res.sendStatus(401)
//     }
// })

router.get('/', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.id)
    if(user){
        res.send(user)
        // res.json({
        //     name: user.name,
        //     username: user.username,
        //     id: user._id,
        //     activeGames: user.activeGames,
        //     friends: user.friends,
        //     gamesPlayed: user.gamesPlayed,
        //     numWins: user.numWins
        // })
    }else{
        res.sendStatus(400)
    }
})

router.get('/:id', authenticateJWT, async(req, res) => {
    let id = req.params.id
    await User.findById(id, (err, user) => {
        if(err){
            console.log(err)
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify({message: "Failure"}))
            res.sendStatus(500)
        }else{
            res.send(user)
        }
    })
})

router.get('/search/:username', authenticateJWT, async(req, res) => {
    const user = await User.findById(req.id)
    let username1 = req.params.username
    await User.find({
        username: {"$regex": new RegExp(username1, "i")}
    }, (err, users) => {
        if(err){
            console.log(err)
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify({message: "Failure"}))
            res.sendStatus(500)
        }else{
            //console.log(JSON.stringify(users))
            let finalUsers = []
            for(let user1 of users){
                if(user1.public){
                    finalUsers.push(user1)
                }
            }
            // console.log(finalUsers)
            // console.log(users)
            res.send(finalUsers)
            // res.send(users)
        }
    })
})

router.post('/requestFriend', authenticateJWT, async(req, res) => {
    const user = await User.findById(req.id)
    const userToBeAdded = await User.findById(req.body.id)
    if(!user || !userToBeAdded){
        res.sendStatus(404)
        return
    }
    if(user.friends.includes(userToBeAdded)){
        return res.status(409).json({ friends: "Already friends with this user!"})
    }
    if(user.sentFriendRequests.includes(userToBeAdded)){
        return res.status(409).json({ friends: "Already sent friend request!"})
    }
    await User.findByIdAndUpdate({_id: user._id}, {$addToSet: {sentFriendRequests: userToBeAdded._id}})
    await User.findByIdAndUpdate({_id: userToBeAdded._id}, {$addToSet: {incomingFriendRequests: user._id}})
    res.send({user1: user.username, user2: userToBeAdded.username})
})

router.get('/incomingFriendRequests/:id', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404).send()
        return
    }
    let requests = []
    for(let request of user.incomingFriendRequests){
        const user1 = (await User.findById(request))
        requests.push({user1})
    }
    res.send(requests)
})

router.get('/sentFriendRequests/:id', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404).send()
        return
    }
    let requests = []
    for(let request of user.sentFriendRequests){
        const user1 = (await User.findById(request))
        requests.push({user1})
    }
    res.send(requests)
})

router.post('/acceptFriend', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.id)
    const userToBeAdded = await User.findById(req.body.id)
    if(!user || !userToBeAdded){
        res.sendStatus(404)
        return
    }
    await User.findByIdAndUpdate({_id: user._id}, {$addToSet: {friends: userToBeAdded._id}})
    await User.findByIdAndUpdate({_id: userToBeAdded._id}, {$addToSet: {friends: user._id}})
    await User.findByIdAndUpdate({_id: user._id}, {$pull: {incomingFriendRequests: userToBeAdded._id}})
    await User.findByIdAndUpdate({_id: userToBeAdded._id}, {$pull: {sentFriendRequests: user._id}})
})

router.post('/rejectFriend', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.id)
    const userToBeDeclined = await User.findById(req.body.id)
    if(!user || !userToBeDeclined){
        res.sendStatus(404)
        return
    }
    await User.findByIdAndUpdate({_id: user._id}, {$pull: {incomingFriendRequests: userToBeDeclined._id}})
    await User.findByIdAndUpdate({_id: userToBeDeclined._id}, {$pull: {sentFriendRequests: user._id}})
})

router.get('/friends/:id', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404).send()
        return
    }
    let friends = []
    for(let friend of user.friends){
        const user1 = (await User.findById(friend))
        friends.push({user1})
    }
    res.send(friends)
})

router.post('/removeFriend', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.id)
    const userToBeRemoved = await User.findById(req.body.id)
    if(!user || !userToBeRemoved){
        res.sendStatus(404)
        return
    }

    await User.findByIdAndUpdate({_id: user._id}, {$pull: {friends: userToBeRemoved._id}})
    await User.findByIdAndUpdate({_id: userToBeRemoved._id}, {$pull: {friends: user._id}})

    res.sendStatus(200);
})

router.get('/access/:id', authenticateJWT, async (req, res) => {
    const userToFind = await User.findById(req.params.id)
    const user = await User.findById(req.id)
    if(!user || !userToFind){
        res.sendStatus(404)
        return
    }
    if(user.friends.includes(userToFind) || userToFind.public){
        return true
    }
    return false
})

router.get('/privacy/:id', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user){
        res.status(404).send()
        return
    }
    res.send(user.public)
})

router.post('/changePrivacy', authenticateJWT, async (req, res) => {
    const user = await User.findById(req.body.id)
    if(!user){
        res.status(404).send()
        return
    }
    (user.public) ? await User.findByIdAndUpdate({_id: user._id}, {public: false}) : await User.findByIdAndUpdate({_id: user._id}, {public: true})
})


module.exports = router;
