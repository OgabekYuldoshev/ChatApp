const express = require("express")
const route = express.Router()
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const Jwt = require("jsonwebtoken")
const User = require("../DB/DB")
const { validRegister, validLogin } = require("../DB/Validator")

route.use(bodyParser.json())

route.get("/auth", async(req, res)=>{
    res.send(await User.find())
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
        res.status(201).send("Created")
    } catch (error) {
        res.status(500).send(error)
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
            }).status(200).send("User Found")
        }
    } catch (error) {
        res.status(500).send(error)
    }
} )



module.exports = route