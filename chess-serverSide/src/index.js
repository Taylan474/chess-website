const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const { addPlayer, removePlayer, getGameByID, findPlayerByID, games } = require("./game");
const cors = require("cors");

const app = express();

app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies
app.get("/", (req, res) => res.send({ status: "healthy" }));  // Health check endpoint

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",  // Replace with your client's origin
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("New client connected with ID:", socket.id);

    socket.on("join", ({ name, gameID }, callback) => {
        console.log("Player joining:", name, "GameID:", gameID);

        if (!name || !gameID) {
            return callback({ error: "Name and GameID are required" });
        }

        const { error, player, opponent } = addPlayer({
            gameID,
            name,
            playerID: socket.id,
        });

        if (error) {
            return callback({ error });
        }

        socket.join(gameID);  // Join the game room
        callback({ color: player.color });  // Send player's color back to client

        // Emit username and client ID (socket ID) to client
        socket.emit("setUsername", { username: name, clientID: socket.id });

        // Send welcome message to player and notify opponent if exists
        socket.emit("welcome", {
            message: `Hello ${player.name}, Welcome to the game`,
            opponent,
        });

        if (opponent) {
            socket.broadcast.to(gameID).emit("opponentJoin", {
                message: `${player.name} has joined the game`,
                opponent: player.name,
            });
        }
    });

    socket.on("move", ({ gameID, from, to }) => {
        console.log("Move received:", { gameID, from, to });
        socket.broadcast.to(gameID).emit("opponentMove", { from, to });
    });

    socket.on("resign", ({ gameID, playerName }) => {
        console.log("Player resigned in game:", gameID, "by", playerName);
        const player = findPlayerByID(socket.id);
        const opponent = getGameByID(gameID).players.find(p => p.playerID !== socket.id);
        
        if (player) {
            io.to(gameID).emit("opponentResign", { playerName });
            io.to(gameID).emit("gameOver", { status: "resign", resigner: player.color });
            console.log("Game Over:", { gameID, status: "resign", resigner: player.color });  // Log for server-side debugging
    
            // If you want to notify players individually, emit separate events
            socket.broadcast.to(gameID).emit("opponentResign", { playerName });  // Emit to opponent
            socket.emit("opponentResign", { playerName });  // Emit to resigning player
        }
    });

    socket.on("gameOver", ({ gameID, status, resigner }) => {
        console.log("Game over:", { gameID, status, resigner });
        io.to(gameID).emit("gameOver", { status, resigner });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        const player = removePlayer(socket.id);
        if (player) {
            socket.broadcast.to(player.gameID).emit("message", {
                name: "Admin",
                message: `${player.name} has left the game`,
            });
        }
    });
});

server.listen(PORT, () => console.log("Server running on port " + PORT));
