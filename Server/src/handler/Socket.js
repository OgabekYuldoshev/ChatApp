const { Socket } = require("socket.io")

module.exports = (io) =>{
  io.on("connection", (socket)=>{
    console.log("Socket Connected")
  })
}