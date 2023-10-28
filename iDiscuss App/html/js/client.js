const socket = io("http://localhost:8000");

// Get dom elements in a respective js variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// Audio that will play on recieving message 
var audio = new Audio("../../html/audio.mp3");

//Function which will append event info to the conatainer 
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

// Ask new user  name and let the server know
const name = prompt("Enter Your name to join");
socket.emit("new-user-joined", name);

// if a new user joined, recieve the event from the server
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

// if server sends a message, recceive it
socket.on("receive", (data) => {
  append(`${data.name}; ${data.message}`, "left");
});

// if a user leaves the chat, append the info to the coantainer
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});

// if the form gets submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
  audio.play();
});
