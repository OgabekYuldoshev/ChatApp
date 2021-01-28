const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        min: 6,
        required: true,
    }
}, {
    timestamps:true
})

const User = mongoose.model("Users", Schema)

module.exports = User