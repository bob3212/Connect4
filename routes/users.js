const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const keys = require("../config/keys")

// Load input validation
const validateSignupInput = require("../validate/signup");
const validateLoginInput = require("../validate/login");
// Load User model
const User = require("../models/User");

router.post("/signup", (req, res) => {
    const { errors, isValid } = validateSignupInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }

    User.findOne({ username: req.body.username }).then(user => {
        if(user){
            return res.status(400).json({ username: "Username already exists!"})
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
    console.log(req.body)

    const { errors, isValid } = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }

    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username }).then(user => {
        if(!user){
            return res.status(400).json({ username: "Username not found!"})
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
                const payload = {
                    id: user.id,
                    name: user.name
                }
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 1000000 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        })
                    }
                )
            } else {
                return res.status(400).json({ incorrectPass: "Password incorrect. Please try again."})
            }
        })
    })
})

module.exports = router;