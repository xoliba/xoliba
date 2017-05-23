var gameboard;

function setGameboard(gameBoard) {
    gameboard = gameBoard;
}

function validateMove(firstX, firstY, secondX, secondY) {
    if (!stonesBetweenAreWhite(firstX, firstY, secondX, secondY)) {
        return false;
    } else if (!stonesAreOnTheSameLine(firstX, firstY, secondX, secondY)) {
        return false;
    }
    hitStones(triangle[0], triangle[1], triangle[2], triangle[3], triangle[4], triangle[5]);
    return true;
}

function stonesBetweenAreWhite(firstX, firstY, secondX, secondY) {
    if (firstX == secondX) {
        var min = Math.min(firstY, secondY);
        var max = Math.max(firstY, secondY);
        for (var i = min + 1; i < max; i++) {
            if (gameboard[firstX][i] != 0) {
                return false;
            }
        }
    } else if (firstY == secondY) {
        var min = Math.min(firstX, secondX);
        var max = Math.max(firstX, secondX);
        for (var i = min + 1; i < max; i++) {
            if (gameboard[i][firstY] != 0) {
                return false;
            }

        }
    } else if ((firstX > secondX && firstY > secondY) || (firstX < secondX && firstY < secondY)) {
        var minX = Math.min(firstX, secondX);
        var maxX = Math.max(firstX, secondX);
        var minY = Math.min(firstY, secondY);
        for (var i = minX + 1; i < maxX; i++) {
            minY++;
            if (gameboard[i][minY] != 0) {
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
            if (gameboard[i][minY] != 0) {
                console.log(i, minY, gameboard[i][minY]);

                return false;
            }

        }
    }


    return true;
}

function stonesAreOnTheSameLine(firstX, firstY, secondX, secondY) {
    var diffX = Math.abs(firstX - secondX);
    var diffY = Math.abs(firstY - secondY);
    return firstX == secondX || firstY == secondY || diffX == diffY;
}

var triangle = []
function trianglesFound(positionX, positionY) {
    var color = gameboard[positionX][positionY];
    var found = 0;
    var foundOnThisDirection = 0;
    let hypotenuseDirections = [[-1,0],[1,0],[0,-1],[0,1]]; //left, right, down, up
    let edgeDirections = [[-1,1,-1,-1],[1,1,1,-1],[-1,-1,1,-1],[-1,1,1,1]] //left, right, down, up
    
    for (var i = 2; i <= 6; i += 2) { //for all possible triangle distances
        let distanceSide = i / 2;
        for (var j = 0; j < 4; j++) { //for all four directions
            found += lookForTriangles(positionX, positionY, hypotenuseDirections[j][0] * i, hypotenuseDirections[j][1] * i, edgeDirections[j][0] * distanceSide, edgeDirections[j][1] * distanceSide,edgeDirections[j][2] * distanceSide,edgeDirections[j][3] * distanceSide, color)
        }
    }
    return found;
}

function lookForTriangles(originX, originY, directionX, directionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) {
    let foundOnThisDirection = 0;
    try {
        foundOnThisDirection = 0;
        if (gameboard[originX + directionX][originY + directionY] == color) {
            foundOnThisDirection += checkDiagonals(originX, originY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color);
            if (foundOnThisDirection == 2) {
                foundOnThisDirection++;
            }
        } else if (checkDiagonals(originX, originY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) == 2) {
            foundOnThisDirection++;
        }
        console.log("for stone (" + originX + "," + originY + ") to the direction of stone (" + (originX + directionX) + "," + (originY + directionY) + ") "
            + "found " + foundOnThisDirection + " triangles");
    } catch (e) {
    }
    return foundOnThisDirection;
}

function checkDiagonals(positionX, positionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) {
    return checkDiagonal(positionX, positionY, firstChangeX, firstChangeY, color) + checkDiagonal(positionX, positionY, secondChangeX, secondChangeY, color);
}

function checkDiagonal(positionX, positionY, firstChangeX, firstChangeY, color) {
    var result = 0;
    if (gameboard[positionX + firstChangeX][positionY + firstChangeY] == color) {
        result++;
    }
    return result;
}

function hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY) {
    if (firstX == secondX) {
        hitVerticalTriangle(firstX, firstY, secondY, thirdX);
    } else if (firstX == thirdX) {

    } else if (secondX == thirdX) {

    } else if (firstY == secondY) {

    } else if (firstY == thirdY) {

    } else if (secondY == thirdY) {

    }
}

function hitVerticalTriangle(startX, firstY, secondY, endX) {
    var min = Math.min(firstY, secondY);
    var max = Math.max(firstY, secondY);
    var n = 1;
    if (endX < startX) {
        n *= -1;
        var help = startX;
        startX = endX;
        endX = help;
    }
    for (var i = startX; i < endX; i += n) {
        for (var j = min; j < max; j++) {
            if (j == firstY || j == secondY) {
                continue;
            }
            gameboard[i][j] = 0;
            sprites[i][j].setTexture("images/whiteCircle64.png");
        }
        min++;
        max--;
    }
    }