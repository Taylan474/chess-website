import React from "react";
import "./board-style.css";
import Square from "../square/square"
import PropTypes from "prop-types";
import { useContext } from "react";
import { GameContext } from "../../context/chessGameContext";


const Board = ({ squares, checkPosition, ...props }) => {
    const { playerColor } = useContext(GameContext);    // Accessing playerColor from GameContext

    const reversedSquares = playerColor === "w" ? squares : [...squares].reverse();             //used for flipping the board

    return (
        <div className="board">
            {reversedSquares.map((square, index) => (
                <Square square={square} index={index} key={square.pos} checkPosition={checkPosition} {...props} />
            ))}
        </div>
    );
};

Board.prototype = {
    squares: PropTypes.array.isRequired,
    makeMove: PropTypes.func,
    setFromPos: PropTypes.func,
    checkPosition: PropTypes.string, 
};

export default Board;
