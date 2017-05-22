var gameboard;

function setGameboard(gameBoard){
  gameboard = gameBoard;
}

function validateMove(firstX, firstY, secondX, secondY){
  var whites = stonesBetweenAreWhite(firstX, firstY, secondX, secondY);

}

function stonesBetweenAreWhite(firstX, firstY, secondX, secondY){
  if(firstX == secondX){
    var min = Math.min(firstY, secondY);
    var max = Math.max(firstY, secondY);
    for (var i = min; i < max; i++) {
      if(gameboard[firstX][i] != 0){
        return false;
      }
    }
  }
}
