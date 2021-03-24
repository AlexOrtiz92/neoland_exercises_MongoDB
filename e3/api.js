const { appInit } = require("./appConfig")
const { bbddInit } = require("./bbddConf")

const messagesChat = require("./models/messages")

const api = appInit()
bbddInit()

api.get("/api/messages", (request, response) => {

  messagesChat.find((err, data) => {
    if (err) {
      console.error(err)
    } else {
      response.send(data)
    }
  })
})

api.post("/api/messages", (request, response) => {

  const { nick, message } = request.body
  const momentoActual = new Date()
  const hora = momentoActual.getHours()
  const minutos = momentoActual.getMinutes()

  const newMessage = new messagesChat({
    nick,
    message,
    time: `${hora}:${minutos}`,
  })
  newMessage.save((err) => {
    if (err) {
      console.error(err)
    } else {
      response.send({
        nota: "mensaje añadido correctamente",
        message: newMessage
      })
    }
  })
})





const port = "3333";
const host = "127.0.0.1";

api.listen(port, host, () => {
  console.log(`API de messages corriendo en http://${host}:${port}/api/messages`);
});


