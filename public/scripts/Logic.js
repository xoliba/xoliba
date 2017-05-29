import * as PIXI from 'pixi.js';

var gameboard;
var sprites;
var startingTurn;

class Logic {

    constructor(gameBoard, starting) {
        this.gameboard = gameBoard;
        this.startingTurn = starting;
        if (this.startingTurn === 0) {
            if (Math.random() > 0.5) {
                this.startingTurn = 1;
                this.turnIndicator("blue", "BLUES");
            } else {
                this.startingTurn = -1;
                this.turnIndicator("red", "REDS");
            }
        }
        if (this.startingTurn > 0) {
            this.startingTurn = -1;
            this.turnIndicator("blue", "BLUES");
        } else {
            this.startingTurn = 1;
            this.turnIndicator("red", "REDS");
        }
        //TODO add turn counter to indicate amount of turns without stones being hit
    }

    turnIndicator(color, turn) {
        var turnTeller = document.getElementById("turn");
        turnTeller.style.color = color;
        turnTeller.innerHTML = "It's " + turn + " turn!";
    }

    setSprites(s) {
        this.sprites = s;
    }

    swap2DArrayPositions(array, firstX, firstY, secondX, secondY) {
        var help = array[firstX][firstY];
        array[firstX][firstY] = array[secondX][secondY];
        array[secondX][secondY] = help;
    }

    validateMove(firstX, firstY, secondX, secondY, movesAvailableCheck) {
            if (!this.stonesBetweenAreWhite(firstX, firstY, secondX, secondY)) {
                return false;
            } else if (!this.stonesAreOnTheSameLine(firstX, firstY, secondX, secondY)) {
                return false;
            }
            this.swap2DArrayPositions(this.gameboard, firstX, firstY, secondX, secondY); //swap the positions and check if triangles are found
            if (this.trianglesFound(secondX, secondY, false) === 0) {
                this.swap2DArrayPositions(this.gameboard, firstX, firstY, secondX, secondY);
                return false;
            } else if (movesAvailableCheck) {
                this.swap2DArrayPositions(this.gameboard, firstX, firstY, secondX, secondY);
            }
            //if(stonesHitted yms.) turnCounter = 0; else turnCounter++;
            return true;
    }

    stonesBetweenAreWhite(firstX, firstY, secondX, secondY) {
        if (firstX === secondX) {
            let min = Math.min(firstY, secondY);
            let max = Math.max(firstY, secondY);
            for (let i = min + 1; i < max; i++) {
                if (this.gameboard[firstX][i] !== 0) {
                    return false;
                }
            }
        } else if (firstY === secondY) {
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

    changeTurn() {
        if (this.startingTurn === 1) {
            this.startingTurn = -1;
            this.turnIndicator("blue", "BLUES");
        } else {
            this.startingTurn = 1;
            this.turnIndicator("red", "REDS");
        }
    }

    getTurn() {
        return this.startingTurn;
    }

    stonesAreOnTheSameLine(firstX, firstY, secondX, secondY) {
        var diffX = Math.abs(firstX - secondX);
        var diffY = Math.abs(firstY - secondY);
        return firstX === secondX || firstY === secondY || diffX === diffY;
    }

    isMovesAvailable() {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (this.gameboard[i][j] === this.startingTurn && this.moveFound(i, j)) {
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

    trianglesFound(positionX, positionY, getBiggest) {
        var color = this.gameboard[positionX][positionY];
        var found = 0;
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
        console.log("FOUND: " + found);
        return found;

    }

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

        console.log("for stone (" + originX + "," + originY + ") to the direction of stone (" + (originX + directionX) + "," + (originY + directionY) + ") "
            + "found " + triangles + " triangles, foundOnThisDirection is " + foundOnThisDirection + " is target on board " + this.isThisOnBoard(targetX, targetY));

        return triangles;
    }

    isThisOnBoard(x, y) {
        return x >= 0 && x <= 6 && y <= 6 && y >= 0; //if the target is out of board

    }

    checkDiagonals(positionX, positionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) {
        return this.checkIfColour(positionX + firstChangeX, positionY + firstChangeY, color) + this.checkIfColour(positionX + secondChangeX, positionY + secondChangeY, color);
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

    hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY) { //TODO validate that the triangle is legal

        //TODO is it possible to get rid of this if thingy?
        if (firstX === secondX) {
            return this.hitTriangle(firstY, secondY, firstX, thirdX, thirdY, true);
        } else if (firstX === thirdX) {
            return this.hitTriangle(firstY, thirdY, firstX, secondX, secondY, true);
        } else if (secondX === thirdX) {
            return this.hitTriangle(secondY, thirdY, secondX, firstX, firstY, true);
        } else if (firstY === secondY) {
            return this.hitTriangle(firstX, secondX, firstY, thirdY, thirdX, false);
        } else if (firstY === thirdY) {
            return this.hitTriangle(firstX, thirdX, firstY, secondY, secondX, false);
        } else if (secondY === thirdY) {
            return this.hitTriangle(secondX, thirdX, secondY, firstY, firstX, false);
        }
    }

    hitTriangle(basis1, basis2, bottomH, tipH, tipPosition, isVertical) {
        let width = Math.abs(basis1 - basis2);

        if (width % 2 !== 0 || width / 2 !== Math.abs(tipH - bottomH) || Math.abs(basis1 - tipPosition) !== Math.abs(basis2 - tipPosition)) {
            return false;
        }

        let min = Math.min(basis1, basis2);
        let max = Math.max(basis1, basis2);
        let n = 1;
        let triangleFloor = bottomH;
        if (tipH < bottomH) { //if tip is smaller, we have to go through the triangle from different direction
            n *= -1;
        }
        for (let i = 0; i < Math.abs(tipH - bottomH); i++) { //we walk through all the floors of the triangle
            for (let j = min; j <= max; j++) {
                if (j === basis1 || j === basis2) {
                    continue;
                }

                if (isVertical) { //we walk through triangle "floors" in vertical direction (y-axis)
                    this.gameboard[triangleFloor][j] = 0;
                    this.sprites[triangleFloor][j].texture = PIXI.loader.resources["images/whiteCircle64.png"].texture;
                } else { //walk the floors in horizontal dir, (x-axis)
                    this.gameboard[j][triangleFloor] = 0;
                    this.sprites[j][triangleFloor].texture = PIXI.loader.resources["images/whiteCircle64.png"].texture;
                }
            }
            triangleFloor += n; //we walk floors up if the tip is higher than bottom and vica verca
            min++;
            max--;
        }
        this.changeTurn();
        return true;
    }

}

//export { setGameboard, setSprites, hitStones, validateMove, getTurn, isMovesAvailable, changeTurn, trianglesFound };
//module.exports.NewLogic NewLogic;

export { Logic };
