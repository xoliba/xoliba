class Actions {

    hitStones(firstX, firstY, secondX, secondY, thirdX, thirdY, gameboard) {

        //Validation is performed in function hitTriangle
        if (firstX === secondX) {
            return this.hitTriangle(firstY, secondY, firstX, thirdX, thirdY, true, gameboard);
        } else if (firstX === thirdX) {
            return this.hitTriangle(firstY, thirdY, firstX, secondX, secondY, true, gameboard);
        } else if (secondX === thirdX) {
            return this.hitTriangle(secondY, thirdY, secondX, firstX, firstY, true, gameboard);
        } else if (firstY === secondY) {
            return this.hitTriangle(firstX, secondX, firstY, thirdY, thirdX, false, gameboard);
        } else if (firstY === thirdY) {
            return this.hitTriangle(firstX, thirdX, firstY, secondY, secondX, false, gameboard);
        } else if (secondY === thirdY) {
            return this.hitTriangle(secondX, thirdX, secondY, firstY, firstX, false, gameboard);
        }
        return false;
    }

    //This method is a bit disgusting.
    /*
      So in a nutshell: basis1 is the first sharp tip and the basis2 is the second.
      BottomH is the second coordinate of those above.
      TipH is the position of the tip, same direction as bottomH.
      tipPosition is tecnically the half point of basis1 and basis2.
      isVertical does what it says.

      Simple, isnt it? If its hard to understand, look at the hitStones -function.

      THIS FUNCTION IS NOT TESTED SEPARATELY. so please refactor parameters as you want.
    */
    hitTriangle(basis1, basis2, bottomH, tipH, tipPosition, isVertical, gameboard) {
        let width = Math.abs(basis1 - basis2);

        if (width % 2 !== 0 || width / 2 !== Math.abs(tipH - bottomH) || Math.abs(basis1 - tipPosition) !== Math.abs(basis2 - tipPosition)) {
            //are the parameters valid: triangle base is even length, the tip is middle of the base
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
                    //this.sprites[triangleFloor][j].texture = PIXI.loader.resources["images/whiteCircle64.png"].texture;
                } else { //walk the floors in horizontal dir, (x-axis)
                    gameboard[j][triangleFloor] = 0;
                    //this.sprites[j][triangleFloor].texture = PIXI.loader.resources["images/whiteCircle64.png"].texture;
                }
            }
            triangleFloor += n; //we walk floors up if the tip is higher than bottom and vica verca
            min++;
            max--;
        }
        //this.changeTurn();
        return true;
    }
}

module.exports.Logic = Actions;

export { Actions };
