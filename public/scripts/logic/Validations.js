import { Helpers } from '../Helpers.js';

//var gameboard;
var helpers;

class Validations {

    constructor() {
        //this.gameboard = gameboard;
        this.helpers = new Helpers();
    }

    turnIndicator(color, turn) {
        //deprecated
        /*var turnTeller = document.getElementById("turn");
        turnTeller.style.color = color;
        turnTeller.innerHTML = "It's " + "turnTeller" + " turn!";*/
    }

    moveIsValid(firstX, firstY, secondX, secondY, board) {
        if (!this.stonesBetweenAreWhite(firstX, firstY, secondX, secondY, board)) {
            return false;
        }

        var boardCopy = this.helpers.arrayCopy(board);
        this.helpers.swap2DArrayPositions(boardCopy, firstX, firstY, secondX, secondY);

        if (this.trianglesFound(secondX, secondY, boardCopy, false) === 0) {
            return false;
        } else {
            return true;
        }
    }

    stonesBetweenAreWhite(firstX, firstY, secondX, secondY, board) {
        if (!this.stonesAreOnTheSameLine(firstX, firstY, secondX, secondY)) {
            return false;
        }
        if (firstX === secondX) { //vertical
            let min = Math.min(firstY, secondY);
            let max = Math.max(firstY, secondY);
            for (let i = min + 1; i < max; i++) {
                if (board[firstX][i] !== 0) {
                    return false;
                }
            }
        } else if (firstY === secondY) { //horizontal
            let min = Math.min(firstX, secondX);
            let max = Math.max(firstX, secondX);
            for (let i = min + 1; i < max; i++) {
                if (board[i][firstY] !== 0) {
                    return false;
                }
            }
        } else if ((firstX > secondX && firstY > secondY) || (firstX < secondX && firstY < secondY)) {
            let minX = Math.min(firstX, secondX);
            let maxX = Math.max(firstX, secondX);
            let minY = Math.min(firstY, secondY);
            for (let i = minX + 1; i < maxX; i++) {
                minY++;
                if (board[i][minY] !== 0) {
                    return false;
                }
            }
        } else {
            let minX = Math.min(firstX, secondX);
            let maxX = Math.max(firstX, secondX);
            let minY = Math.max(firstY, secondY);
            for (let i = minX + 1; i < maxX; i++) {
                minY--;
                if (board[i][minY] !== 0) {
                    return false;
                }
            }
        }
        return true;
    }

    stonesAreOnTheSameLine(firstX, firstY, secondX, secondY) {
        var diffX = Math.abs(firstX - secondX);
        var diffY = Math.abs(firstY - secondY);
        return firstX === secondX || firstY === secondY || diffX === diffY;
    }

    isMovesAvailable(startingTurn, board) {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (board[i][j] === startingTurn && this.moveFound(i, j, board)) {
                    return true;
                }
            }
        }
        return false;
    }

    moveFound(x, y, board) {
        for (let i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                if ((i === 0 && (j === 0 || j === 6)) || (i === 6 && ( j === 0 || j === 6)) || (x === i && y === j) || board[i][j] !== 0) {
                    continue;
                } else if (this.moveIsValid(x, y, i, j, board)) {
                    return true;
                }
            }
        }
        return false;
    }

    //If getBiggest is true, will return 1, 2 or 3.
    //If false, will return the amount of triangles.
    trianglesFound(positionX, positionY, board, getBiggest) {
        let color = board[positionX][positionY];
        let found = 0;
        let hypotenuseDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]]; //left, right, down, up
        let edgeDirections = [[-1, 1, -1, -1], [1, 1, 1, -1], [-1, -1, 1, -1], [-1, 1, 1, 1]]; //left, right, down, up

        let biggest = 0;
        for (let i = 2; i <= 6; i += 2) { //for all possible triangle distances
            let distanceSide = i / 2;
            for (let j = 0; j < 4; j++) { //for all four directions
                found += this.lookForTriangles(positionX, positionY, hypotenuseDirections[j][0] * i, hypotenuseDirections[j][1] * i, edgeDirections[j][0] * distanceSide, edgeDirections[j][1] * distanceSide, edgeDirections[j][2] * distanceSide, edgeDirections[j][3] * distanceSide, color, board);
            }
            if (getBiggest && found > 0) {
                biggest = i / 2;
                found = 0;
            }
        }
        if (getBiggest) {
            return biggest;
        }
        //console.log("FOUND: " + found);
        return found;
    }

    //THIS FUNCTION IS NOT TESTED SEPARATELY. so please refactor parameters as you want.
    lookForTriangles(originX, originY, directionX, directionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color, board) {
        let foundOnThisDirection = 0;
        let triangles = 0;
        let targetX = originX + directionX;
        let targetY = originY + directionY;
        foundOnThisDirection += this.checkDiagonals(originX, originY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color, board);


        if (!this.isThisOnBoard(targetX, targetY)) { //if the target is out of board
            if (foundOnThisDirection === 2) { //if there are two on diagonals. THIS IS IMPORTANT even tho the target is not on board.
                triangles = 1;
            } else {
                triangles = 0;
            }
        } else if (foundOnThisDirection === 0 || (foundOnThisDirection === 1 && board[originX + directionX][originY + directionY] !== color)) { //no triangles, target on board
            triangles = 0;
        } else if (foundOnThisDirection === 2 && board[originX + directionX][originY + directionY] === color) { //all four stones are the right colour
            triangles = 3;
        } else {
            triangles = 1;
        }

        console.info("for stone (" + originX + "," + originY + ") to the direction of stone (" + (originX + directionX) + "," + (originY + directionY) + ") "
            + "found " + triangles + " triangles, foundOnThisDirection is " + foundOnThisDirection + " is target on board " + this.isThisOnBoard(targetX, targetY));
        return triangles;
    }

    isThisOnBoard(x, y) {
        return x >= 0 && x <= 6 && y <= 6 && y >= 0; //if the target is out of board

    }

    //THIS FUNCTION IS NOT TESTED SEPARATELY. so please refactor parameters as you want.
    checkDiagonals(positionX, positionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color, board) {
        return this.checkIfColour(positionX + firstChangeX, positionY + firstChangeY, color, board) +
        this.checkIfColour(positionX + secondChangeX, positionY + secondChangeY, color, board);
    }

    checkIfColour(targetX, targetY, color, board) {
        var result = 0;
        if (this.isThisOnBoard(targetX, targetY)) {
            if (board[targetX][targetY] === color) {
                result++;
            }
        }
        return result;
    }

     checkIfTriangle(firstX, firstY, secondX, secondY, thirdX, thirdY, gameboard) {

        //Validation is performed in function hitTriangle
        //Will return false (0) when triangle is invalid, 1 when no stones were hit and 2 when stones are hit.
        if (firstX === secondX) {
            return this.isTriangle(firstY, secondY, firstX, thirdX, thirdY, true, gameboard);
        } else if (firstX === thirdX) {
            return this.isTriangle(firstY, thirdY, firstX, secondX, secondY, true, gameboard);
        } else if (secondX === thirdX) {
            return this.isTriangle(secondY, thirdY, secondX, firstX, firstY, true, gameboard);
        } else if (firstY === secondY) {
            return this.isTriangle(firstX, secondX, firstY, thirdY, thirdX, false, gameboard);
        } else if (firstY === thirdY) {
            return this.isTriangle(firstX, thirdX, firstY, secondY, secondX, false, gameboard);
        } else if (secondY === thirdY) {
            return this.isTriangle(secondX, thirdX, secondY, firstY, firstX, false, gameboard);
        }
        return false;
    }
        isTriangle(basis1, basis2, bottomH, tipH, tipPosition, isVertical, gameboard) {
        let width = Math.abs(basis1 - basis2);

        if (width % 2 !== 0 || width / 2 !== Math.abs(tipH - bottomH) || Math.abs(basis1 - tipPosition) !== Math.abs(basis2 - tipPosition)) {
            //are the parameters valid: triangle base is even length, the tip is middle of the base
            return false;
        }
}
}

module.exports.Validations = Validations;

export { Validations };
