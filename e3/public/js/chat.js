const socket = io();
const buttonMessage = document.querySelector("#buttonMessage");
const urlAPI = "http://127.0.0.1:3333/api/messages"

const getAllMessages = () => {
  fetch(urlAPI).then((response) => {
    return response.json()
  }).then((data) => {
    const ul = document.getElementById("ulMessages");

    const allMessages = data.map((message) => `<li class="message"><span class="bold">${message.nick}:</span> ${message.message}
    <div class="hora">
      <p class="p-hora">${message.time}</p>
    </div>
  </li>`).reduce((acc, next) => acc + next, "")

    ul.innerHTML = allMessages
  })
}
getAllMessages()

const addNewMessage = (nick, message) => {

  const newChat = {
    nick: nick,
    message: message
  }

  const opts = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(newChat)
  };

  fetch(urlAPI, opts).then((response) => {
    return response.json()
  }).then((data) => {
    console.log(`mensaje ${data} añadido correctamente`)
    console.log(data)
    getAllMessages()
  }).catch((err) => {
    console.error(err)
  })
}

const sendMessage = () => {
  const inputMessage = document.querySelector("#inputMessage").value
  const userName = sessionStorage.getItem("nick")

  socket.emit("addMessage", inputMessage, userName)


}




buttonMessage.addEventListener("click", () => {

  sendMessage()

})



socket.on("paintMessage", (message, user) => {

  if (sessionStorage.getItem("nick") !== user) {
    //le he metido setTimeOut por si acaso lo hace antes qu elo otro
    setTimeout(() => {
      getAllMessages()
    }, 500)

  } else {

    addNewMessage(user, message)
  }
})

const keyPress = (event) => {
  if (event.keyCode === 13 && !event.shiftKey) {
    event.preventDefault(); //Previene de cosas raras que hace el nav
    sendMessage();
  }
};