# Real-Time Chess Game

A simple real-time multiplayer chess app built with React, Node.js, and Socket.IO. This project supports real-time communication between two players in the same match — no backend database, no lobby, just pure chess.

# Demo

Two players can play in real-time with synchronized moves and resign detection.

![Main menu](https://github.com/user-attachments/assets/539e34da-71fb-47ac-9e38-5163d8622d76)


# Features

+ Real-time multiplayer with Socket.IO

+ Simple username + game code join system

+ Turn-based logic and board sync

+ Game over on resignation

+ Fully responsive interface

# Getting Started

**Note: Requires Node.js version 18. You can use nvm to manage multiple Node versions.**

1. Start the Server

```
cd chess-serverSide
npm install
npm audit fix --force
npm start
```

The server will run on port 5000.

2. Start the Client

Open a second terminal and run:

```
cd chess-clientSide
npm install --force
npm audit fix --force
npm start
```

The client will be available at http://localhost:3000.

To simulate both players, open two browser tabs with the same address.


# Gameplay in Action
![Player 1 moves](https://github.com/user-attachments/assets/28fd15d7-5db4-4440-b635-c1837b614090)
![Player 2 view after one move](https://github.com/user-attachments/assets/390a95b5-49cc-4371-a2a0-3ef494288e34)



# Game Over Button after resigining
![Game over screen after resigning](https://github.com/user-attachments/assets/28ff89ea-d017-4b9e-8589-a8f9a9b2d631)

# Tech Stack

+ Frontend: React, Chess.js, Socket.IO Client

+ Backend: Node.js, Express, Socket.IO

# License

This project is open source and available under the MIT License.

# Future Improvements

+ Add timers for each player

+ Implement game replay feature

+ Add lobby system

+ Implement chat between players

# Contributions and pull requests are welcome.

# Project by Taylan.


