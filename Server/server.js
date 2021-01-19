require("dotenv").config()
const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const morgan = require("morgan")
const helmet = require("helmet")
const app = express();
const Auth = require("./src/Routes/Auth")

app.use(cors())
app.use("/api", Auth)
app.use(bodyParser.json())
app.use(helmet())
app.use(morgan("combined"))


mongoose.connect(process.env.DB_HOST, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log("Connect to DB")).catch(err=>console.log(err))



app.listen(process.env.Port || 8000, ()=>console.log("Project is working..."))