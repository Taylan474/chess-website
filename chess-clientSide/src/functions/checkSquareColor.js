 export const checkSquareColor = (position, index) => {

    const row = position[1];
    const isEven = (x) => !(x % 2); // isEven() function


    /*
        When the row number is odd, then all of the even cells are light colored,
        and if the row number is even, then all of the odd cells are light colored.
        Knowing this, we can check for light squares this way:
        Note: index+1 because we count from 1 on the chessboard, like a1,a2,a3....
    */


    if (isEven(row) && !isEven(index + 1)) {
        return true;
    }

    if (isEven(index + 1) && !isEven(row)) {
        return true;
    }
    return false;
};

