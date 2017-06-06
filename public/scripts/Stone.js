//import * as PIXI from 'pixi.js';
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
var PIXI;

class Stone {

    constructor(value, x, y, app, PIXI, turnHandler) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.isChosen = false;
        this.PIXI = PIXI;

        this.createSprite(app, turnHandler);
    }

    createSprite(app, turnHandler) {
        let path = "";
        if (this.value === -1) {
            path = "images/blueCircle64.png";
        } else if (this.value === 0) {
            path = "images/whiteCircle64.png";
        } else if (this.value === 1) {
            path = "images/redCircle64.png";
        }

        this.sprite = new this.PIXI.Sprite(
            this.PIXI.loader.resources[path].texture
        );

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.x = padding + this.x * px;
        this.sprite.y = padding + this.y * px;
        this.sprite.width = radius * 2;
        this.sprite.height = radius * 2;

        this.sprite.on('pointerdown', turnHandler.spriteClicked(this));

        app.stage.addChild(this.sprite);
    }

    choose() {
        if (this.isChosen) {
            return;
        }

        this.isChosen = true;

        enlargeSprite();
    }

    unchoose() {
        if (!this.isChosen) {
            return;
        }

        this.isChosen = false;

        minimizeSprite();
    }

    swap(stone) {
        if (this.x === stone.x && this.y === stone.y) {
            return;
        }

        swapCoordinates(this, stone);

        updateSpriteCoordinates(this);
        updateSpriteCoordinates(stone);
    }

    swapCoordinates(stoneA, stoneB) {
        let tmpx = stoneA.x;
        let tmpy = stoneA.y;
        stoneA.x = stoneB.x;
        stoneA.y = stoneB.y;
        stoneB.x = tmpx;
        stoneB.y = tmpy;
    }

    /*set value(value) {
        if (this.value === value) {
            return;
        }

        this.value = value;
        
        updateSprite();
    }*/

    /*get value() {
        return this.value;
    }*/

    updateSpriteCoordinates(stone) {
        stone.sprite.x = padding + stone.x * px;
        stone.sprite.x = padding + stone.y * px;
    }

    updateSprite() {
        if (this.value === 0) {
            this.sprite.texture = this.PIXI.loader.resources["images/whiteCircle64.png"].texture;
        } else if (this.value === 1) {
            this.sprite.texture = this.PIXI.loader.resources["images/redCircle64.png"].texture;
        } else if (this.value === -1) {
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