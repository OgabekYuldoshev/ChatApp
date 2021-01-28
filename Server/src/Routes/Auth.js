const express = require("express")
const route = express.Router()
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const Jwt = require("jsonwebtoken")
const User = require("../handler/DB")
const { validRegister, validLogin } = require("../handler/Validator")


route.use(bodyParser.json())

route.get("/user", async(req, res)=>{
    const token = req.headers["authorization"]

    if(token === undefined || token === null){
        res.status(401).json({msg:"You need to Sign Up"})
  }
    const user = Jwt.verify(token, process.env.Token_Secret)
    
    const userInfo = await User.findOne({username: user.username})
    res.status(200).json(userInfo)
})

route.post("/register", async(req, res)=>{
    const validData = await validRegister.validateAsync(req.body)
    const hashed = await bcrypt.hash(validData.password, await bcrypt.genSalt(10))
    const newUser = new User({
        username: validData.username,
        email: validData.email,
        gender: validData.gender,
        password: hashed,
        })
    try {
        await newUser.save()
        res.status(201).json({msg:"Created"})
    } catch (error) {
        res.status(500).json({msg:error})
    }
})

route.post("/login", async(req, res)=>{
    const validData = await validLogin.validateAsync(req.body)
    const user = await User.findOne({username: validData.username})
    try {
        const validPassword = await bcrypt.compare(validData.password, user.password)
        const token = Jwt.sign({
            username: user.username,
            email: user.email
        }, process.env.Token_Secret)
        if(!user || validPassword !== true){
            res.status(404).json({msg: "Username or Email incorrect!"})
        } else {
            res.header({
                "X-Auth-Token": token
            }).status(200).json({
                username: user.username,
                access_token: token
            }) 
        }
    } catch (error) {
        res.status(500).json({msg:error})
    }
} )



module.exports = route