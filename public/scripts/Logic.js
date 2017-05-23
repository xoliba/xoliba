var gameboard;
var sprites;

function setGameboard(gameBoard) {
    gameboard = gameBoard;
}

function setSprites(s){
  sprites = s;
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
    let triangles = 0;
    let targetX = originX + directionX;
    let targetY = originY + directionY;
    foundOnThisDirection += checkDiagonals(originX, originY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color);


    if (!isThisOnBoard(targetX, targetY)) { //if the target is out of board
      if (foundOnThisDirection == 2) { //if there are two on diagonals
        triangles = 1;
      } else {
        triangles = 0;
      }
    } else if (foundOnThisDirection == 0 || (foundOnThisDirection == 1 && gameboard[originX + directionX][originY + directionY] != color)) { //no triangles, target on board
      triangles = 0;
    } else if (foundOnThisDirection == 2 && gameboard[originX + directionX][originY + directionY] == color) { //all four stones are the right colour
      triangles = 3;
    } else {
      triangles = 1;
    }

    console.log("for stone (" + originX + "," + originY + ") to the direction of stone (" + (originX + directionX) + "," + (originY + directionY) + ") "
        + "found " + triangles + " triangles, foundOnThisDirection is " + foundOnThisDirection + " is target on board " + isThisOnBoard(targetX, targetY));

    return triangles;
}

function isThisOnBoard(x,y) {
  return x >= 0 && x <= 6 && y <= 6 && y >= 0 //if the target is out of board

}

function checkDiagonals(positionX, positionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) {
    return checkIfColour(positionX + firstChangeX, positionY + firstChangeY, color) + checkIfColour(positionX + secondChangeX, positionY + secondChangeY, color);
}

function checkIfColour(targetX, targetY, color) {
    var result = 0;
    if (isThisOnBoard(targetX, targetY)) {
      if (gameboard[targetX][targetY] == color) {
          result++;
      }
    }
    console.log("\tcheckDiagonal: stone at (" + targetX + ", " + targetY + ") is color " + color + " bool:" + result);
    return result;
}

function hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY) {
    if (firstX == secondX) {
        hitVerticalTriangle(firstY, secondY, firstX, thirdX);
    } else if (firstX == thirdX) {
        hitVerticalTriangle(firstY, thirdY, firstX, secondX);
    } else if (secondX == thirdX) {
      hitVerticalTriangle(secondY, thirdY, secondX, firstX)
    } else if (firstY == secondY) {
      hitHorizontalTriangle(firstX, secondX, firstY, thirdY);
    } else if (firstY == thirdY) {
      hitHorizontalTriangle(firstX, thirdX, firstY, secondY);
    } else if (secondY == thirdY) {
      hitHorizontalTriangle(secondX, thirdX, secondY, firstY);
    }
}

function hitVerticalTriangle(firstY, secondY, startX, endX) {
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

function hitHorizontalTriangle(firstX, secondX, startY, endY) {
    var min = Math.min(firstX, secondX);
    var max = Math.max(firstX, secondX);
    var n = 1;
    if (endY < startY) {
        n *= -1;
        var help = startY;
        startY = endY;
        endY = help;
    }
    for (var i = startY; i < endY; i += n) {
        for (var j = min; j < max; j++) {
            if (j == firstX || j == secondX) {
                continue;
            }
            gameboard[j][i] = 0;
            sprites[j][i].setTexture("images/whiteCircle64.png");
        }
        min++;
        max--;
    }
}
