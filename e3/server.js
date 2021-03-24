const express = require("express")
const http = require("http")

const app = express()
const server = http.createServer(app)


const io = require("socket.io")(server)

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/html", { extensions: ["html"] }))
app.use(express.static(__dirname + "/public/images"))
app.use(express.static(__dirname + "/public/css"))
app.use(express.static(__dirname + "/public/js"))

app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"))
app.use("/js", express.static(__dirname))
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"))

//configuramos para que lea soccket a traves de nodemodules
app.use("/js", express.static(__dirname + "/node_modules/socket.io/client-dist"))


io.on("connection", (socket) => {

  console.log("nuevo usuario conectado")

  socket.on("addMessage", (message, inputUser) => {

    io.emit("paintMessage", message, inputUser)

  })

  //Evento de DESCONEXION 
  socket.on("disconnect", () => {
    console.log(`usuario desconectado`)
  })
})








const port = "2525";
const host = "127.0.0.1";

server.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}/home`)
})
