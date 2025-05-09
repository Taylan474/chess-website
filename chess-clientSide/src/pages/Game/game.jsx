import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { Chess } from "chess.js";
import { createBoard, getGameOverState } from "../../functions/export";
import Board from "../../components/board/board";
import Player from "../../components/player/player";
import Toast from "../../components/snackbar/snackbar";
import GameOver from "../../components/gameover/gameover";
import Button from "../../components/button/button";
import { GameContext } from "../../context/chessGameContext";
import { types, setMessage, setOpponentMoves, setPlayer, setPlayerColor } from "../../context/chessActions";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import qs from "query-string";
import "./game-style.css";

const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const socket = io("http://localhost:5000");

const Game = () => {
    const [fen, setFen] = useState(FEN); // State for storing FEN position
    const { current: chess } = useRef(new Chess(FEN)); // Ref for chess instance
    const [board, setBoard] = useState(createBoard(FEN)); // State for chessboard
    const { dispatch, gameOver, playerColor } = useContext(GameContext); // Context for game state management
    const [checkPosition, setCheckPosition] = useState(null); // State for check position
    const [playerName, setPlayerName] = useState(""); // State for players name
    const [opponent, setOpponent] = useState(null); // State for opponent details
    const [gameID, setGameID] = useState(""); // State for game ID

    const location = useLocation(); // Location hook for accessing URL query parameters
    const moveHistoryRef = useRef(null); // Ref for move history element

    useEffect(() => {
        setBoard(createBoard(fen)); // Update board state when FEN changes
    }, [fen]);

    useEffect(() => {
        const { id, name } = qs.parse(location.search); // Parse query string for game ID and players name
        setPlayerName(name || ""); // Set players name from query parameter or empty string
        setGameID(id || ""); // Set game ID from query parameter or empty string
    }, [location.search]);

    // Callback to handle game over event
    const handleGameOver = useCallback((status) => {
        dispatch({ type: types.GAME_OVER, status, player: chess.turn() === "w" ? "black" : "white" });
        socket.emit("gameOver", { gameID, status }); // Emit game over event with game ID and status
    }, [chess, dispatch, gameID]);

    useEffect(() => {
        // Ensure playerName and gameID are set before attempting to join
        if (!playerName || !gameID) return;

        // Emit join event to server with players name and game ID
        socket.emit("join", { name: playerName, gameID }, ({ error, color }) => {
            if (error) {
                console.log("Error joining game:", error);
                return;
            }
            dispatch(setPlayer(playerName)); // Set players name in game context
            dispatch(setPlayerColor(color)); // Set players color in game context
        });

        // Handle welcome event from server
        socket.on("welcome", ({ message, opponent }) => {
            dispatch(setMessage(message)); // Dispatch message to game context
            setOpponent(opponent); // Set opponent details in state
        });

        // Handle opponentJoin event from server
        socket.on("opponentJoin", ({ message, opponent }) => {
            dispatch(setMessage(message)); // Dispatch message to game context
            setOpponent(opponent); // Set opponent details in state
        });

        // Handle message event from server
        socket.on("message", ({ name, message }) => {
            dispatch(setMessage(`${name}: ${message}`)); // Dispatch formatted message to game context
        });

        // Handle opponentMove event from server
        socket.on("opponentMove", ({ from, to }) => {
            try {
                chess.move({ from, to }); // Attempt to move opponents piece on the board
                setFen(chess.fen()); // Update board state with new FEN
                dispatch(setMessage("Your Turn")); // Dispatch message indicating players turn
                dispatch(setOpponentMoves([from, to])); // Dispatch opponents move to game context
            } catch (error) {
                console.error("Error processing opponent move:", error);
            }
        });

        // Handle opponentResign event from server
        socket.on("opponentResign", () => {
            handleGameOver("resign"); // Trigger game over with resign status
        });

        // Cleanup function to disconnect socket on component unmount
        return () => {
            socket.disconnect();
        };
    }, [dispatch, location.search, chess, handleGameOver, playerName, gameID]);

    useEffect(() => {
        // Check game state and update game context
        const [gameOver, status] = getGameOverState(chess);
        if (gameOver) {
            dispatch({ type: types.GAME_OVER, status, player: chess.turn() });
            return;
        }
        dispatch({
            type: types.SET_TURN,
            player: chess.turn(),
            check: chess.isCheck(),
        });

        // Set check position if king is in check
        if (chess.isCheck()) {
            const kingSquare = chess.board().flat().find(piece => piece && piece.type === "k" && piece.color === chess.turn())?.square;
            setCheckPosition(kingSquare);
        } else {
            setCheckPosition(null);
        }
    }, [fen, dispatch, chess]);

    const fromPos = useRef(); // Ref for storing starting position of move

    // Function to make a move on the board
    const makeMove = (pos) => {
        const from = fromPos.current;
        const pieceColor = chess.get(from).color === "w" ? "w" : "b"; // Determine color of moving piece

        if (pieceColor === playerColor) {
            try {
                const legalMoves = chess.moves({ square: from, verbose: true }).map(move => move.to); // Get legal moves for piece

                if (!legalMoves.includes(pos)) {
                    dispatch(setMessage("Invalid move")); // Dispatch message for invalid move
                } else {
                    dispatch({ type: types.CLEAR_POSSIBLE_MOVES }); // Clear possible move highlights
                    chess.move({ from, to: pos }); // Make move on chess instance
                    setFen(chess.fen()); // Update board state with new FEN
                    socket.emit("move", { gameID, from, to: pos }); // Emit move event with game ID and move details
                }
            } catch (error) {
                console.error("Error making move:", error);
                dispatch(setMessage("Error making move")); // Dispatch message for move error
            }
        } else {
            dispatch(setMessage("Invalid move: Wrong Color")); // Dispatch message for wrong color move
        }
    };

    // Function to set starting position of move
    const setFromPos = (pos) => {
        fromPos.current = pos; // Set current position ref to starting position
        dispatch({ type: types.SET_POSSIBLE_MOVES, moves: chess.moves({ square: pos }) }); // Dispatch possible moves to game context
    };

    // Function to handle player resignation
    const handleResign = () => {
        if (chess.turn() === playerColor) {
            socket.emit("resign", { gameID }); // Emit resign event with game ID
            dispatch({
                type: types.GAME_OVER,
                status: "resign",
                player: chess.turn() === "w" ? "black" : "white",
            });
            socket.emit("gameOver", { gameID, status: "resign" }); // Emit game over event with game ID and resign status
        } else {
            dispatch(setMessage("It's not your turn to resign.")); // Dispatch message for invalid resignation attempt
        }
    };

    const historyLength = chess.history().length;
    // Effect to scroll move history to bottom on change
    useEffect(() => {
        if (moveHistoryRef.current) {
            moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight;
        }
    }, [historyLength]);

    // Render GameOver component if game is over
    if (gameOver) {
        return <GameOver />;
    }

    // Render game components
    return (
        <div className="game">
            <div className="game-info">
                <h2>Game ID:</h2>
                <p>{gameID}</p> {/* Display game ID */}
            </div>
            <Player name={playerName} color={playerColor} player /> {/* Render player component */}
            {opponent && <Player name={opponent.name} color={playerColor === "w" ? "b" : "w"} />} {/* Render opponent component if available */}
            <div className="board-chat-container">
                <div className="board-container">
                    <Board squares={board} makeMove={makeMove} setFromPos={setFromPos} checkPosition={checkPosition} /> {/* Render chess board */}
                </div>
                <div className="move-history">
                    <h3>Move History:</h3>
                    <ol ref={moveHistoryRef}>
                        {chess.history().map((move, index) => (
                            <li key={index}>
                                {index % 2 === 0 ? "white" : "black"}: {move} {/* Render move history */}
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="resign-button">
                    <Button onClick={handleResign}>Resign</Button> {/* Render resign button */}
                </div>
            </div>
            <Toast /> {/* Render toast notifications */}
        </div>
    );
};

export default Game;
