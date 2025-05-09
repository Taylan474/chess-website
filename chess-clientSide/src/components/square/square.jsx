// Square.jsx

import React, { useContext } from "react";
import "./square-style.css";
import PropTypes from "prop-types";
import { checkSquareColor, Square as BoardSquare } from "../../functions/export";
import Piece from "../piece/piece"
import { GameContext } from "../../context/chessGameContext";

const Square = ({ square, index, makeMove, setFromPos, checkPosition }) => {
    const light = checkSquareColor(square.pos, index);                                                      //check if square is light or dark and store in const
    const { possibleMoves, turn, check, playerColor } = useContext(GameContext);                            //get possibleMoves, turn, check and playerColor from chessGameContext
    const isCurrentPlayersTurn = playerColor === turn;                                                      //see if it is current players turn
    const isPossibleMove = isCurrentPlayersTurn && possibleMoves.includes(square.pos);                      //Check if its the current players turn and if the square position is in the list of possible moves

    const handleDrop = () => {
        makeMove(square.pos);                               // Function to handle dropping a piece on the squares position
    };

    const inCheck = () => {
        return square.pos === checkPosition && check;   // Check if the squares position matches the check position and if the game state is in check
    };


    return (
        <div
            className={`square ${light ? "light" : "dark"} ${inCheck() ? "check" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className={`overlay ${isPossibleMove ? "possible-move" : ""}`}>
                <Piece pos={square.pos} name={square.piece} setFromPos={setFromPos} />
            </div>
        </div>
    );
};

Square.propTypes = {
    square: PropTypes.instanceOf(BoardSquare).isRequired,
    index: PropTypes.number.isRequired,
    makeMove: PropTypes.func,
    setFromPos: PropTypes.func,
    checkPosition: PropTypes.string,
};

export default Square;
