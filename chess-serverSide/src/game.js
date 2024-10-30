const games = {};

const addPlayer = ({ gameID, name, playerID }) => {
    let game = games[gameID];

    if (!game) {
        // Create a new game object if it doesn't exist
        game = games[gameID] = {
            players: [],        // Array to store players in the game
            board: initializeBoard(),   // Initialize the game board
            turn: "w",           // White starts the game
        };
    }

    // Determine player color based on existing players in the game
    const color = game.players.length === 0 ? "w" : "b";
    const player = { playerID, name, color };  // Create player object
    game.players.push(player);  // Add player to the game

    // Find opponent for the player based on color
    const opponent = game.players.find(p => p.color !== color);
    return { player, opponent, error: null };  // Return player, opponent, and no error
};

const removePlayer = (playerID) => {
    for (const gameID in games) {
        const game = games[gameID];
        const index = game.players.findIndex(p => p.playerID === playerID);
        if (index !== -1) {
            // Remove player from the game
            const [removedPlayer] = game.players.splice(index, 1);
            if (game.players.length === 0) {
                delete games[gameID];  // Delete game if no players left
            }
            return removedPlayer;  // Return removed player
        }
    }
    return null;  // Return null if player not found
};

const getGameByID = (gameID) => {
    return games[gameID] || null;  // Return game object by ID or null if not found
};

const findPlayerByID = (playerID) => {
    for (const gameID in games) {
        const game = games[gameID];
        const player = game.players.find(p => p.playerID === playerID);
        if (player) return player;  // Return player if found by ID
    }
    return null;  // Return null if player not found
};

module.exports = { addPlayer, removePlayer, getGameByID, findPlayerByID, games };

function initializeBoard() {
    // Initialize and return the starting chess board
    return [];
}
