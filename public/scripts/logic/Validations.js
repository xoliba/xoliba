let gameboard

class Validations {

    constructor(gameboard) {
        this.gameboard = gameboard;
    }

    turnIndicator(color, turn) {
        /*var turnTeller = document.getElementById("turn");
        turnTeller.style.color = color;
        turnTeller.innerHTML = "It's " + "turnTeller" + " turn!";*/
    }

    swap2DArrayPositions(firstX, firstY, secondX, secondY) {
        var help = this.gameboard[firstX][firstY];
        this.gameboard[firstX][firstY] = this.gameboard[secondX][secondY];
        this.gameboard[secondX][secondY] = help;
    }

    validateMove(firstX, firstY, secondX, secondY, movesAvailableCheck) {
            if (!this.stonesBetweenAreWhite(firstX, firstY, secondX, secondY)) {
                return false;
            }
            this.swap2DArrayPositions(firstX, firstY, secondX, secondY); //swap the positions and check if triangles are found
            if (this.trianglesFound(secondX, secondY, false) === 0) {
                this.swap2DArrayPositions(firstX, firstY, secondX, secondY);
                return false;
            } else if (movesAvailableCheck) {
                this.swap2DArrayPositions(firstX, firstY, secondX, secondY);
            }
            return true;
    }

    stonesBetweenAreWhite(firstX, firstY, secondX, secondY) {
        if (!this.stonesAreOnTheSameLine(firstX, firstY, secondX, secondY)) {
            return false;
        }
        if (firstX === secondX) { //vertical
            let min = Math.min(firstY, secondY);
            let max = Math.max(firstY, secondY);
            for (let i = min + 1; i < max; i++) {
                if (this.gameboard[firstX][i] !== 0) {
                    return false;
                }
            }
        } else if (firstY === secondY) { //horizontal
            let min = Math.min(firstX, secondX);
            let max = Math.max(firstX, secondX);
            for (let i = min + 1; i < max; i++) {
                if (this.gameboard[i][firstY] !== 0) {
                    return false;
                }
            }
        } else if ((firstX > secondX && firstY > secondY) || (firstX < secondX && firstY < secondY)) {
            let minX = Math.min(firstX, secondX);
            let maxX = Math.max(firstX, secondX);
            let minY = Math.min(firstY, secondY);
            for (let i = minX + 1; i < maxX; i++) {
                minY++;
                if (this.gameboard[i][minY] !== 0) {
                    return false;
                }
            }
        } else {
            let minX = Math.min(firstX, secondX);
            let maxX = Math.max(firstX, secondX);
            let minY = Math.max(firstY, secondY);
            for (let i = minX + 1; i < maxX; i++) {
                minY--;
                if (this.gameboard[i][minY] !== 0) {
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

    isMovesAvailable(startingTurn) {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (this.gameboard[i][j] === startingTurn && this.moveFound(i, j)) {
                    return true;
                }
            }
        }
        return false;
    }

    moveFound(x, y) {
        for (let i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                if ((i === 0 && (j === 0 || j === 6)) || (i === 6 && ( j === 0 || j === 6)) || (x === i && y === j) || this.gameboard[i][j] !== 0) {
                    continue;
                } else if (this.validateMove(x, y, i, j, true)) {
                    return true;
                }
            }
        }
        return false;
    }

    //If getBiggest is true, will return 1, 2 or 3.
    //If false, will return the amount of triangles.
    trianglesFound(positionX, positionY, getBiggest) {
        let color = this.gameboard[positionX][positionY];
        let found = 0;
        let hypotenuseDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]]; //left, right, down, up
        let edgeDirections = [[-1, 1, -1, -1], [1, 1, 1, -1], [-1, -1, 1, -1], [-1, 1, 1, 1]]; //left, right, down, up

        let biggest = 0;
        for (let i = 2; i <= 6; i += 2) { //for all possible triangle distances
            let distanceSide = i / 2;
            for (let j = 0; j < 4; j++) { //for all four directions
                found += this.lookForTriangles(positionX, positionY, hypotenuseDirections[j][0] * i, hypotenuseDirections[j][1] * i, edgeDirections[j][0] * distanceSide, edgeDirections[j][1] * distanceSide, edgeDirections[j][2] * distanceSide, edgeDirections[j][3] * distanceSide, color);
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
    lookForTriangles(originX, originY, directionX, directionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) {
        let foundOnThisDirection = 0;
        let triangles = 0;
        let targetX = originX + directionX;
        let targetY = originY + directionY;
        foundOnThisDirection += this.checkDiagonals(originX, originY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color);


        if (!this.isThisOnBoard(targetX, targetY)) { //if the target is out of board
            if (foundOnThisDirection === 2) { //if there are two on diagonals
                triangles = 1;
            } else {
                triangles = 0;
            }
        } else if (foundOnThisDirection === 0 || (foundOnThisDirection === 1 && this.gameboard[originX + directionX][originY + directionY] !== color)) { //no triangles, target on board
            triangles = 0;
        } else if (foundOnThisDirection === 2 && this.gameboard[originX + directionX][originY + directionY] === color) { //all four stones are the right colour
            triangles = 3;
        } else {
            triangles = 1;
        }

        /*console.log("for stone (" + originX + "," + originY + ") to the direction of stone (" + (originX + directionX) + "," + (originY + directionY) + ") "
            + "found " + triangles + " triangles, foundOnThisDirection is " + foundOnThisDirection + " is target on board " + this.isThisOnBoard(targetX, targetY));*/
        return triangles;
    }

    isThisOnBoard(x, y) {
        return x >= 0 && x <= 6 && y <= 6 && y >= 0; //if the target is out of board

    }

    //THIS FUNCTION IS NOT TESTED SEPARATELY. so please refactor parameters as you want.
    checkDiagonals(positionX, positionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) {
        return this.checkIfColour(positionX + firstChangeX, positionY + firstChangeY, color) +
        this.checkIfColour(positionX + secondChangeX, positionY + secondChangeY, color);
    }

    checkIfColour(targetX, targetY, color) {
        var result = 0;
        if (this.isThisOnBoard(targetX, targetY)) {
            if (this.gameboard[targetX][targetY] === color) {
                result++;
            }
        }
        return result;
    }
}

module.exports.Validations = Validations;

export { Validations };
