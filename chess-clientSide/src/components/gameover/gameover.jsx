import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GameContext } from "../../context/chessGameContext";
import Layout from "../layout/layout";
import "./gameover-style.css";

const GameOver = () => {
    const { status, turn} = useContext(GameContext);

    console.log("Status:", status); // Add console.log for status
    console.log("Turn:", turn); // Add console.log for turn
    let winner;

    if (status === "checkmate") {
        if (turn === "b") {
            winner = "White";
        } else {
            winner = "Black";
        }
    } else if (status === "resign") {
        if (turn === "black") {
            winner = "Black"; // If white resigned, black is the winner
        } else {
            winner = "White"; // If black resigned, white is the winner
        }
    }

    console.log("Determined Winner:", winner); // Log the determined winner

    const Content = () => (
        <React.Fragment>
            <h1>Game over</h1>
            <p>
                The game ended in a {status}
            </p>
            {winner && (
                <p>
                    {winner} won
                </p>
            )}
            <Link to="/" style={{ color: "white" }}>Go to Homepage</Link>
        </React.Fragment>
    );

    return <Layout Content={Content} />;
};

export default GameOver;