const loginButton = document.getElementById("login")

const loginChat = () => {

  const newNick = document.getElementById("nick").value

  sessionStorage.setItem("nick", newNick);

  window.location.replace("http://127.0.0.1:2525/chat")


}


loginButton.addEventListener("click", () => {

  loginChat()

})

const keyPress = (event) => {
  if (event.keyCode === 13 && !event.shiftKey) {
    event.preventDefault(); //Previene de cosas raras que hace el nav
    loginChat()
  }
};