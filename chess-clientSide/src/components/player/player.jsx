import React from "react";
import "./player-style.css";

const Player = ({ name, color, player }) => {
    const white = color === "w";                    //check if color is white
    const image = white ? "wK" : "bK";              //assign whiteKing or blackKing accordingly

    return (
        <div className={`player ${player ? "player1" : "player2"}`}>
            <p>{name}</p>
            <img
                src={require(`../../assets/pieces/${image}.png`)}       //display image of white/black king accordingly
                alt="King"
                className="king"
            />
        </div>
    );
};

export default Player;