import { StoneSprite } from '../StoneSprite.js';

let value;
let sprite;
var isChosen;
var x;
var y;

class Stone {

    constructor(value, x, y, app, turnHandler) {
        this._value = value;
        this.x = x;
        this.y = y;
        this.isChosen = false;

        this.sprite = new StoneSprite(x, y, app, turnHandler, this);
    }

    choose() {
        if (this.isChosen) {
            return;
        }

        this.isChosen = true;

        this.sprite.enlarge();
    }

    unchoose() {
        if (!this.isChosen) {
            return;
        }

        this.isChosen = false;

        this.sprite.minimize();
    }

    swap(stone) {
        if (this.x === stone.x && this.y === stone.y) {
            return;
        }

        this.swapCoordinates(this, stone);

        this.updateSpriteCoordinates();
        stone.updateSpriteCoordinates();
    }

    swapCoordinates(stoneA, stoneB) {
        let tmpx = stoneA.x;
        let tmpy = stoneA.y;
        stoneA.x = stoneB.x;
        stoneA.y = stoneB.y;
        stoneB.x = tmpx;
        stoneB.y = tmpy;
    }

    set value(value) {
        if (this._value === value) {
            return;
        }

        this._value = value;

        this.sprite.updateColor(value);
    }

    get value() {
        return this._value;
    }

    updateSpriteCoordinates() {
        this.sprite.updateCoordinates(this.x, this.y);
    }
}

module.exports.Stone = Stone;

export { Stone };
