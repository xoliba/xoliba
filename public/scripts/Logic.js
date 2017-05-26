import * as PIXI from 'pixi.js';

var gameboard;
var sprites;
var startingTurn;

function turnIndicator(color, turn) {
    var turnTeller = document.getElementById("turn");
    turnTeller.style.color = color;
    turnTeller.innerHTML = "It's " + turn + " turn!";
}

function setGameboard(gameBoard, starting) {
    gameboard = gameBoard;
    startingTurn = starting;
    if (startingTurn === 0) {
        if (Math.random() > 0.5) {
            startingTurn = 1;
            turnIndicator("blue", "BLUES");
        } else {
            startingTurn = -1;
            turnIndicator("red", "REDS");
        }
    }
    if (startingTurn > 0) {
        startingTurn = -1;
        turnIndicator("blue", "BLUES");
    } else {
        startingTurn = 1;
        turnIndicator("red", "REDS");
    }
    //TODO add turn counter to indicate amount of turns without stones being hit
}

function setSprites(s) {
    sprites = s;
}

function swap2DArrayPositions(array, firstX, firstY, secondX, secondY) {
    var help = array[firstX][firstY];
    array[firstX][firstY] = array[secondX][secondY];
    array[secondX][secondY] = help;
}

function validateMove(firstX, firstY, secondX, secondY, movesAvailableCheck) {
    if (gameboard[firstX][firstY] === startingTurn) {
        if (!stonesBetweenAreWhite(firstX, firstY, secondX, secondY)) {
            return false;
        } else if (!stonesAreOnTheSameLine(firstX, firstY, secondX, secondY)) {
            return false;
        }
        swap2DArrayPositions(gameboard, firstX, firstY, secondX, secondY); //swap the positions and check if triangles are found
        if (trianglesFound(secondX, secondY, false) === 0) {
            swap2DArrayPositions(gameboard, firstX, firstY, secondX, secondY);
            return false;
        } else if (movesAvailableCheck){
            swap2DArrayPositions(gameboard, firstX, firstY, secondX, secondY);
        }
        //if(stonesHitted yms.) turnCounter = 0; else turnCounter++;
        return true;
    }
    return false;
}

function stonesBetweenAreWhite(firstX, firstY, secondX, secondY) {
    if (firstX === secondX) {
        let min = Math.min(firstY, secondY);
        let max = Math.max(firstY, secondY);
        for (let i = min + 1; i < max; i++) {
            if (gameboard[firstX][i] !== 0) {
                return false;
            }
        }
    } else if (firstY === secondY) {
        let min = Math.min(firstX, secondX);
        let max = Math.max(firstX, secondX);
        for (let i = min + 1; i < max; i++) {
            if (gameboard[i][firstY] !== 0) {
                return false;
            }
        }
    } else if ((firstX > secondX && firstY > secondY) || (firstX < secondX && firstY < secondY)) {
        let minX = Math.min(firstX, secondX);
        let maxX = Math.max(firstX, secondX);
        let minY = Math.min(firstY, secondY);
        for (let i = minX + 1; i < maxX; i++) {
            minY++;
            if (gameboard[i][minY] !== 0) {
                return false;
            }
        }
    } else {
        let minX = Math.min(firstX, secondX);
        let maxX = Math.max(firstX, secondX);
        let minY = Math.max(firstY, secondY);
        for (let i = minX + 1; i < maxX; i++) {
            minY--;
            if (gameboard[i][minY] !== 0) {
                return false;
            }
        }
    }
    return true;
}

function changeTurn() {
    if (startingTurn === 1) {
        startingTurn = -1;
        turnIndicator("blue", "BLUES");
    } else {
        startingTurn = 1;
        turnIndicator("red", "REDS");
    }
}

function getTurn(){
    return startingTurn;
}

function stonesAreOnTheSameLine(firstX, firstY, secondX, secondY) {
    var diffX = Math.abs(firstX - secondX);
    var diffY = Math.abs(firstY - secondY);
    return firstX === secondX || firstY === secondY || diffX === diffY;
}

function isMovesAvailable(){
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            if (gameboard[i][j] === startingTurn && moveFound(i, j)){
                return true;
            }
        }
    }
    return false;
}

function moveFound(x, y){
    for (let i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if((i === 0 && (j === 0 || j === 6)) || (i === 6 && ( j === 0 || j === 6)) || (x === i && y === j) || gameboard[i][j] !== 0){
                continue;
            } else if (validateMove(x, y, i, j, true)){
                return true;
            }
        }
    }
    return false;
}

function trianglesFound(positionX, positionY, getBiggest) {
    var color = gameboard[positionX][positionY];
    var found = 0;
    let hypotenuseDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]]; //left, right, down, up
    let edgeDirections = [[-1, 1, -1, -1], [1, 1, 1, -1], [-1, -1, 1, -1], [-1, 1, 1, 1]]; //left, right, down, up

    let biggest = 0;
    for (let i = 2; i <= 6; i += 2) { //for all possible triangle distances
        let distanceSide = i / 2;
        for (let j = 0; j < 4; j++) { //for all four directions
            found += lookForTriangles(positionX, positionY, hypotenuseDirections[j][0] * i, hypotenuseDirections[j][1] * i, edgeDirections[j][0] * distanceSide, edgeDirections[j][1] * distanceSide, edgeDirections[j][2] * distanceSide, edgeDirections[j][3] * distanceSide, color);
        }
        if(getBiggest && found > 0){
            biggest = i / 2;
            found = 0;
        }
    }
    if (getBiggest){
        return biggest;
    }
    console.log("FOUND: " + found);
    return found;

}

function lookForTriangles(originX, originY, directionX, directionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) {
    let foundOnThisDirection = 0;
    let triangles = 0;
    let targetX = originX + directionX;
    let targetY = originY + directionY;
    foundOnThisDirection += checkDiagonals(originX, originY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color);


    if (!isThisOnBoard(targetX, targetY)) { //if the target is out of board
        if (foundOnThisDirection === 2) { //if there are two on diagonals
            triangles = 1;
        } else {
            triangles = 0;
        }
    } else if (foundOnThisDirection === 0 || (foundOnThisDirection === 1 && gameboard[originX + directionX][originY + directionY] !== color)) { //no triangles, target on board
        triangles = 0;
    } else if (foundOnThisDirection === 2 && gameboard[originX + directionX][originY + directionY] === color) { //all four stones are the right colour
        triangles = 3;
    } else {
        triangles = 1;
    }

    console.log("for stone (" + originX + "," + originY + ") to the direction of stone (" + (originX + directionX) + "," + (originY + directionY) + ") "
            + "found " + triangles + " triangles, foundOnThisDirection is " + foundOnThisDirection + " is target on board " + isThisOnBoard(targetX, targetY));

    return triangles;
}

function isThisOnBoard(x, y) {
    return x >= 0 && x <= 6 && y <= 6 && y >= 0; //if the target is out of board

}

function checkDiagonals(positionX, positionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) {
    return checkIfColour(positionX + firstChangeX, positionY + firstChangeY, color) + checkIfColour(positionX + secondChangeX, positionY + secondChangeY, color);
}

function checkIfColour(targetX, targetY, color) {
    var result = 0;
    if (isThisOnBoard(targetX, targetY)) {
        if (gameboard[targetX][targetY] === color) {
            result++;
        }
    }
    return result;
}

function hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY) { //TODO validate that the triangle is legal

//TODO is it possible to get rid of this if thingy?
    if (firstX === secondX) {
        return hitTriangle(firstY, secondY, firstX, thirdX, thirdY, true);
    } else if (firstX === thirdX) {
        return hitTriangle(firstY, thirdY, firstX, secondX, secondY, true);
    } else if (secondX === thirdX) {
        return hitTriangle(secondY, thirdY, secondX, firstX, firstY, true);
    } else if (firstY === secondY) {
        return hitTriangle(firstX, secondX, firstY, thirdY, thirdX, false);
    } else if (firstY === thirdY) {
        return hitTriangle(firstX, thirdX, firstY, secondY, secondX, false);
    } else if (secondY === thirdY) {
        return hitTriangle(secondX, thirdX, secondY, firstY, firstX, false);
    }
}

function hitTriangle(basis1, basis2, bottomH, tipH, tipPosition, isVertical) {
    let width = Math.abs(basis1 - basis2);

    if(width % 2 !== 0 || width / 2 !== Math.abs(tipH - bottomH) || Math.abs(basis1 - tipPosition) !== Math.abs(basis2 - tipPosition)){
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
                gameboard[triangleFloor][j] = 0;
                sprites[triangleFloor][j].texture = PIXI.loader.resources["images/whiteCircle64.png"].texture;
            } else { //walk the floors in horizontal dir, (x-axis)
                gameboard[j][triangleFloor] = 0;
                sprites[j][triangleFloor].texture = PIXI.loader.resources["images/whiteCircle64.png"].texture;
            }
        }
        triangleFloor += n; //we walk floors up if the tip is higher than bottom and vica verca
        min++;
        max--;
    }
    changeTurn();
    return true;
}

export { setGameboard, setSprites, hitStones, validateMove, getTurn, isMovesAvailable, changeTurn, trianglesFound };
