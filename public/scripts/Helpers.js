class Helpers {
    getStonesArrayPosition(coordinate, padding, px) {
        return Math.round((coordinate - padding) / px);
    }

    checkTurn(x, y, stonesArray, logic) {
        return stonesArray[x][y] === logic.getTurn();
    }

    addCorner(x, y, corners) {
        corners.push(x);
        corners.push(y);
    }

    swap2DArrayPositions(array, firstX, firstY, secondX, secondY) {
        var help = array[firstX][firstY];
        array[firstX][firstY] = array[secondX][secondY];
        array[secondX][secondY] = help;
    }

    swapPositions(spriteA, spriteB) {
        let tmpx = spriteA.x;
        let tmpy = spriteA.y;
        spriteA.x = spriteB.x;
        spriteA.y = spriteB.y;
        spriteB.x = tmpx;
        spriteB.y = tmpy;
    }

    enlarge(sprite, highlightScaling) {
        sprite.scale.x += highlightScaling;
        sprite.scale.y += highlightScaling;
    }

    minimize(sprite, highlightScaling) {
        sprite.scale.x -= highlightScaling;
        sprite.scale.y -= highlightScaling;
    }
}


export { Helpers };