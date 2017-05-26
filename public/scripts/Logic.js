var gameboard;
var sprites;
var startingTurn;
var turnCounter;

function setGameboard(gameBoard, starting) {
    gameboard = gameBoard;
    startingTurn = starting;
    console.log("starting turn in logic: " + startingTurn)
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
    turnCounter = 0;

}

function setSprites(s) {
    sprites = s;
}
function swap2DArrayPositions(array, firstX, firstY, secondX, secondY) {
        var help = array[firstX][firstY];
        array[firstX][firstY] = array[secondX][secondY];
        array[secondX][secondY] = help;
    }

function validateMove(firstX, firstY, secondX, secondY) {
    if (gameboard[firstX][firstY] === startingTurn) {
        if (!stonesBetweenAreWhite(firstX, firstY, secondX, secondY)) {
            return false;
        } else if (!stonesAreOnTheSameLine(firstX, firstY, secondX, secondY)) {
            return false;
        }
        swap2DArrayPositions(gameboard, firstX, firstY, secondX, secondY); //swap the positions and check if triangles are found
        if ((trianglesFound(secondX, secondY)) == 0) {
            swap2DArrayPositions(gameboard, firstX, firstY, secondX, secondY);
            return false;
        }
        //if(stonesHitted yms.) turnCounter = 0; else turnCounter++;
        return true;
    }
    return false;
}

function stonesBetweenAreWhite(firstX, firstY, secondX, secondY) {
    if (firstX === secondX) {
        var min = Math.min(firstY, secondY);
        var max = Math.max(firstY, secondY);
        for (var i = min + 1; i < max; i++) {
            if (gameboard[firstX][i] !== 0) {
                return false;
            }
        }
    } else if (firstY === secondY) {
        var min = Math.min(firstX, secondX);
        var max = Math.max(firstX, secondX);
        for (var i = min + 1; i < max; i++) {
            if (gameboard[i][firstY] !== 0) {
                return false;
            }
        }
    } else if ((firstX > secondX && firstY > secondY) || (firstX < secondX && firstY < secondY)) {
        var minX = Math.min(firstX, secondX);
        var maxX = Math.max(firstX, secondX);
        var minY = Math.min(firstY, secondY);
        for (var i = minX + 1; i < maxX; i++) {
            minY++;
            if (gameboard[i][minY] !== 0) {
                console.log(i, minY, gameboard[i][minY]);

                return false;
            }
        }
    } else {
        var minX = Math.min(firstX, secondX);
        var maxX = Math.max(firstX, secondX);
        var minY = Math.max(firstY, secondY);
        for (var i = minX + 1; i < maxX; i++) {
            minY--;
            if (gameboard[i][minY] !== 0) {
                console.log(i, minY, gameboard[i][minY]);

                return false;
            }
        }
    }
    return true;
}

function chansetsurn() {
    if (startingTurn === 1) {
        startingTurn = -1;
        turnIndicator("blue", "BLUES");
    } else {
        startingTurn = 1;
        turnIndicator("red", "REDS");
    }
}

function turnIndicator(color, turn){
    var turnTeller = document.getElementById("turn");
    turnTeller.style.color = color;
    turnTeller.innerHTML = "It's " + turn + " turn!"
}
function stonesAreOnTheSameLine(firstX, firstY, secondX, secondY) {
    var diffX = Math.abs(firstX - secondX);
    var diffY = Math.abs(firstY - secondY);
    return firstX === secondX || firstY === secondY || diffX === diffY;
}

var triangle = [];
function trianglesFound(positionX, positionY) {
    var color = gameboard[positionX][positionY];
    var found = 0;
    let hypotenuseDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]]; //left, right, down, up
    let edgeDirections = [[-1, 1, -1, -1], [1, 1, 1, -1], [-1, -1, 1, -1], [-1, 1, 1, 1]] //left, right, down, up

    for (var i = 2; i <= 6; i += 2) { //for all possible triangle distances
        let distanceSide = i / 2;
        for (var j = 0; j < 4; j++) { //for all four directions
            found += lookForTriangles(positionX, positionY, hypotenuseDirections[j][0] * i, hypotenuseDirections[j][1] * i, edgeDirections[j][0] * distanceSide, edgeDirections[j][1] * distanceSide, edgeDirections[j][2] * distanceSide, edgeDirections[j][3] * distanceSide, color);
        }
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
    console.log("\tcheckDiagonal: stone at (" + targetX + ", " + targetY + ") is color " + color + " bool:" + result);
    return result;
}

function hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY) { //TODO validate that the triangle is legal
    console.log("hit stones, corners at (" + firstX + ", " + firstY + "), (" + secondX + ", " + secondY + ") and (" + thirdX + ", " + thirdY + ")");

//TODO is it possible to get rid of this if thingy?
    if (firstX === secondX) {
        hitTriangle(firstY, secondY, firstX, thirdX, true);
    } else if (firstX === thirdX) {
        hitTriangle(firstY, thirdY, firstX, secondX, true);
    } else if (secondX === thirdX) {
        hitTriangle(secondY, thirdY, secondX, firstX, true);
    } else if (firstY === secondY) {
        hitTriangle(firstX, secondX, firstY, thirdY, false);
    } else if (firstY === thirdY) {
        hitTriangle(firstX, thirdX, firstY, secondY, false);
    } else if (secondY === thirdY) {
        hitTriangle(secondX, thirdX, secondY, firstY, false);
    }
}

function hitTriangle(basis1, basis2, bottomH, tipH, isVertical) {
    console.log("hit triangle: basis b1,b2 " + basis1 + "," + basis2 + "; bottom height " + bottomH + "; tip height " + tipH + "; is vertical " + isVertical);
    let min = Math.min(basis1, basis2);
    let max = Math.max(basis1, basis2);
    let n = 1;
    let triangleFloor = bottomH;
    if (tipH < bottomH) { //if tip is smaller, we have to go through the triangle from different direction
        n *= -1;
    }
    for (var i = 0; i < Math.abs(tipH - bottomH); i++) { //we walk through all the floors of the triangle
        for (var j = min; j <= max; j++) {
            if (j === basis1 || j === basis2) {
                console.log("spare corner (" + i + ", " + j + ")");
                continue;
            }

            console.log("hit stone i,j (" + i + ", " + j + ") is vertical " + isVertical);

            if (isVertical) { //we walk through triangle "floors" in vertical direction (y-axis)
                gameboard[triangleFloor][j] = 0;
                sprites[triangleFloor][j].setTexture(PIXI.loader.resources["images/whiteCircle64.png"].texture);
            } else { //walk the floors in horizontal dir, (x-axis)
                gameboard[j][triangleFloor] = 0;
                sprites[j][triangleFloor].setTexture(PIXI.loader.resources["images/whiteCircle64.png"].texture);
            }
        }
        triangleFloor += n; //we walk floors up if the tip is higher than bottom and vica verca
        min++;
        max--;
    }
    changeTurn();
}

export { setGameboard, setSprites, hitStones };
