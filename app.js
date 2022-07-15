const http = require("http")
const express = require("express");
const app = express();
const socketIo = require("socket.io");
const fs = require("fs");

const server = http.Server(app).listen(3000);
const io = socketIo(server);
const clients = {};

app.use(express.static(__dirname + "/client.js/"));
app.use(express.static(__dirname + "/style.css/"));
app.use(express.static(__dirname + "/../node_modules/"));

app.get("/", (req, res) => {
    var path = require('path');
    res.sendFile(path.resolve('index.html'));
});

var players = {};
var unmatched;

io.on("connection", function(socket) {
    let id = socket.id;

    console.log("New client connected. ID: ", socket.id);
    clients[socket.id] = socket;

    socket.on("disconnect", () => {
        console.log("Client disconnected. ID: ", socket.id);
        delete clients[socket.id];
        socket.broadcast.emit("clientdisconnect", id);
    });

    join(socket);

    if (opponentOf(socket)) {
        socket.emit("game.begin", {
            symbol: players[socket.id].symbol
        });

        opponentOf(socket).emit("game.begin", {
            symbol: players[opponentOf(socket).id].symbol 
        });
    }

    socket.on("make.move", function(data) {
        if (!opponentOf(socket)) {
            return;
        }

        socket.emit("move.made", data);
        opponentOf(socket).emit("move.made", data);
    });

    socket.on("disconnect", function() {
        if (opponentOf(socket)) {
        opponentOf(socket).emit("opponent.left");
        }
    });
});


function join(socket) {
    players[socket.id] = {
        opponent: unmatched,
        symbol: "X",
        socket: socket
    };

    if (unmatched) { 
        players[socket.id].symbol = "O";
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

function opponentOf(socket) {
    if (!players[socket.id].opponent) {
        return;
    }
    return players[players[socket.id].opponent].socket;
}