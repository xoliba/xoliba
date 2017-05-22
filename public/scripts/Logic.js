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

function stonesBetweenAreWhite(firstX, firstY, secondX, secondY){
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

function stonesAreOnTheSameLine(firstX, firstY, secondX, secondY){
  var diffX = Math.abs(firstX - secondX);
  var diffY = Math.abs(firstY - secondY);
  return firstX == secondX || firstY == secondY || diffX == diffY;
}
