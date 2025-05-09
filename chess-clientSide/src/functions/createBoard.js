export class Square {
    constructor(pos, piece) {
        this.pos = pos;
        this.piece = piece;
    }
}

//  returns an array of range 1, n
const range = (n) => {
    return Array.from({ length: n }, (_, i) => i + 1);
};


export const createBoard = (fenString) => {
    const fen = fenString.split(" ")[0]; // Get the first portion
    const fenPieces = fen.split("/").join(""); // Remove the row delimiters "/"

    let pieces = Array.from(fenPieces);
    Array.from(fenPieces).forEach((item, index) => {
        if (isFinite(item)) {
            pieces.splice(index, 1, range(item).fill(""));
        }
    });
    pieces = pieces.flat();

    const rows = range(8).map((n) => n.toString()).reverse(); // ["8", "7", "6", "5", "4", "3", "2", "1"]
    const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const squares = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0; j < columns.length; j++) {
            const col = columns[j];
            squares.push(col + row);
        }
    }

    const board = [];
    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];
        const piece = pieces[i];
        board.push(new Square(square, piece));
     
    }

    return board;
};




console.log(
    createBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
);

