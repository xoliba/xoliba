import * as PIXI from 'pixi.js';
import { scale } from './Draw.js';
import { TurnHandler } from './TurnHandler.js';

const padding = scale() / 10;
const px = scale() / 7.5;
const radius = px / 4;
const highlightScaling = radius / 100;

let value;
let sprite;
var isChosen;
var x;
var y;
//var PIXI;
PIXI.loader.add([
    "images/whiteCircle64.png",
    "images/blueCircle64.png",
    "images/redCircle64.png"
]).load();
class Stone {

    constructor(value, x, y, app, turnHandler) {
        this._value = value;
        this.x = x;
        this.y = y;
        this.isChosen = false;

        this.createSprite(app, turnHandler);
    }


    createSprite(app, turnHandler) {
        //let path = "";
        if (this._value === -1) {
            this.sprite = new PIXI.Sprite.fromImage('/images/blueCircle64.png');
            //path = "images/blueCircle64.png";
        } else if (this._value === 0) {
            this.sprite = new PIXI.Sprite.fromImage('/images/whiteCircle64.png');
            //path = "images/whiteCircle64.png";
        } else if (this._value === 1) {
            this.sprite = new PIXI.Sprite.fromImage('/images/redCircle64.png');
            //path = "images/redCircle64.png";
        }

        /*this.sprite = new PIXI.Sprite(
            PIXI.loader.resources[path].texture
        );*/

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.x = padding + this.x * px;
        this.sprite.y = padding + this.y * px;
        this.sprite.width = radius * 2;
        this.sprite.height = radius * 2;

        this.sprite.on('pointerdown', () => {
            turnHandler.spriteClicked(this)
        });


        app.stage.addChild(this.sprite);
    }



    choose() {
        if (this.isChosen) {
            return;
        }

        this.isChosen = true;

        this.enlargeSprite();
    }

    unchoose() {
        if (!this.isChosen) {
            return;
        }

        this.isChosen = false;

        this.minimizeSprite();
    }

    swap(stone) {
        if (this.x === stone.x && this.y === stone.y) {
            return;
        }

        this.swapCoordinates(this, stone);

        this.updateSpriteCoordinates(this);
        this.updateSpriteCoordinates(stone);
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

        this.updateSprite();
    }

    get value() {
        return this._value;
    }

    updateSpriteCoordinates(stone) {
        stone.sprite.x = padding + stone.x * px;
        stone.sprite.y = padding + stone.y * px;
    }

    updateSprite() {
        if (this._value === 0) {
            this.sprite.texture = this.PIXI.loader.resources["images/whiteCircle64.png"].texture;
        } else if (this._value === 1) {
            this.sprite.texture = this.PIXI.loader.resources["images/redCircle64.png"].texture;
        } else if (this._value === -1) {
            this.sprite.texture = this.PIXI.loader.resources["images/blueCircle64.png"].texture;
        }
    }

    enlargeSprite() {
        this.sprite.scale.x += highlightScaling;
        this.sprite.scale.y += highlightScaling;
    }

    minimizeSprite() {
        this.sprite.scale.x -= highlightScaling;
        this.sprite.scale.y -= highlightScaling;
    }
}

module.exports.Stone = Stone;

export { Stone };
