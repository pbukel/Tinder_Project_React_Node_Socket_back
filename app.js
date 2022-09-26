const express = require("express");

require("dotenv").config();
const cors = require("cors");
const mainRouter = require("./routes/mainRouter");
const session = require("express-session");
const app = express();
const http = require("http").createServer(app);
const socket = require("socket.io");
const {
  addRemoveLikes,
  sendFavorites,
  sendWhoLikeMe,
} = require("./modules/dataModule");

const io = socket(http, { cors: { origin: "http://localhost:3000" } });

let users = [];

io.on("connect", (socket) => {
  socket.on("setLike", (data) => {
    const { me, otherOne } = data;
    const index = users.findIndex((object) => object.username === otherOne);
    console.log(index);
    if (index === -1) {
      addRemoveLikes(me, otherOne).then((res) => {
        io.to(socket.id).emit("updatingLogedUser", res[0]);
      });
    } else {
      addRemoveLikes(me, otherOne).then((res) => {
        io.to(socket.id).emit("updatingLogedUser", res[0]);
        io.to(users[index].id).emit("updatingLogedUser", res[1]);
      });
    }

    // updateAllUsers(me).then((res) => {
    //   io.to(socket.id).emit("updateUsersData", res);
    // });
    // sendWhoLikeMe(me).then((res) => {
    //   socket.emit("updateTheyLikeMe", res);
    // });
  });
  socket.on("getFavorites", (data) => {
    sendFavorites(data).then((res) => {
      io.to(socket.id).emit("updateFavorites", res);
    });
  });
  socket.on("getWhoLikeMe", (data) => {
    sendWhoLikeMe(data).then((res) => {
      socket.emit("updateTheyLikeMe", res);
    });
  });
  socket.on("userConnect", (data) => {
    if (data === null) return;
    const index = users.findIndex((x) => x.username === data.userName);
    console.log(data.userName);
    console.log(index);
    // checking if user already connected
    const newUser = {
      id: socket.id,
      username: data.userName,
    };
    if (index === -1) {
      users.push(newUser);
    } else {
      users[index] = newUser;
    }

    console.log(users);
    // console.log(data);
  });
  socket.on("disconnect", () => {
    users = users.filter((x) => x.id !== socket.id);
  });
  socket.on("logout", () => {
    users = users.filter((x) => x.id !== socket.id);
    console.log("logedout");
  });
});

http.listen(4000);
app.use(cors({ origin: true, credentials: true, methods: "GET, POST" }));

app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: true,
  })
);

//express.json visada virs mainRouter
app.use(express.json());

app.use("/", mainRouter);
