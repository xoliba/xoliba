var gameboard;

function setGameboard(gameBoard){
  gameboard = gameBoard;
}

function validateMove(firstX, firstY, secondX, secondY){
  if(!stonesBetweenAreWhite(firstX, firstY, secondX, secondY)){
    return false;
  } else if (!stonesAreOnTheSameLine(firstX, firstY, secondX, secondY)){
    return false;
  }
  return true;
}

function stonesBetweenAreWhite(firstX, firstY, secondX, secondY) {
  if(firstX == secondX){
    var min = Math.min(firstY, secondY);
    var max = Math.max(firstY, secondY);
    for (var i = min+1; i < max; i++) {
      if(gameboard[firstX][i] != 0){
        return false;
      }
    }
  }
  else if (firstY == secondY) {
    var min = Math.min(firstX, secondX);
    var max = Math.max(firstX, secondX);
    for (var i = min+1; i < max; i++) {
      if(gameboard[i][firstY] != 0) {
        return false;
      }

    }
  }
  else if ((firstX > secondX && firstY > secondY) || (firstX < secondX && firstY < secondY)) {
      var minX = Math.min(firstX, secondX);
      var maxX = Math.max(firstX, secondX);
      var minY = Math.min(firstY, secondY);
      for (var i = minX+1; i < maxX; i++) {
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
      for (var i = minX+1; i < maxX; i++) {
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

function trianglesFound(positionX, positionY) {
  var color = gameboard[positionX][positionY];
  var found = 0;
  var foundOnThisDirection = 0;
  for (var i = 2; i <= 6; i += 2) {
    try {
      foundOnThisDirection = 0;
      if (gameboard[positionX + i][positionY] == color) {
        foundOnThisDirection += checkDiagonals(positionX, positionY, i/2, i/2, i/2, -1 * i/2, color);
        if(foundOnThisDirection == 2){
          foundOnThisDirection++;
        }
        found += foundOnThisDirection;
      } else if (checkDiagonals(positionX, positionY, i/2, i/2, i/2, -1 * i/2, color) == 2){
        found++;
      }
      console.log(positionX + i, positionY, foundOnThisDirection, found);
    } catch (e) {
    }

    try{
      foundOnThisDirection = 0;
      if (gameboard[positionX - i][positionY] == color) {
        foundOnThisDirection += checkDiagonals(positionX, positionY, -1 * i/2, i/2, -1 * i/2, -1 * i/2, color);
        if(foundOnThisDirection == 2){
          foundOnThisDirection++;
        }
        found += foundOnThisDirection;
      } else if (checkDiagonals(positionX, positionY, -1 * i/2, i/2, -1 * i/2, -1 * i/2, color) == 2){
        found++;
      }
      console.log(positionX - i, positionY, foundOnThisDirection, found)
    } catch (e){
    }

    try{
      foundOnThisDirection = 0;
      if (gameboard[positionX][positionY + i] == color) {
        foundOnThisDirection += checkDiagonals(positionX, positionY, i/2, i/2, -1 * i/2, i/2, color);
        if(foundOnThisDirection == 2){
          foundOnThisDirection++;
        }
        found += foundOnThisDirection;
      } else if (checkDiagonals(positionX, positionY, i/2, i/2, -1 * i/2, i/2, color) == 2){
        found++;
      }
      console.log(positionX, positionY + i, foundOnThisDirection, found)
    } catch (e){
    }

    try{
      foundOnThisDirection = 0;
      if (gameboard[positionX][positionY - i] == color) {
        foundOnThisDirection += checkDiagonals(positionX, positionY, i/2, -1 * i/2, -1 * i/2, -1 * i/2, color);
        if(foundOnThisDirection == 2){
          foundOnThisDirection++;
        }
        found += foundOnThisDirection;
      } else if (checkDiagonals(positionX, positionY, i/2, i/2, i/2, -1 * i/2, color) == 2){
        found++;
      }
      console.log(positionX, positionY - i, foundOnThisDirection, found)
    } catch (e){
    }
  }
  return found;
}

function checkDiagonals(positionX, positionY, firstChangeX, firstChangeY, secondChangeX, secondChangeY, color) {
  var result = 0;
  if (gameboard[positionX + firstChangeX][positionY + firstChangeY] == color) {
    result++;
  }
  if (gameboard[positionX + secondChangeX][positionY + secondChangeY] == color) {
    result++;
  }
  return result;
}
