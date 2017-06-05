import * as PIXI from 'pixi.js';
import { scale } from './Draw.js';

const padding = scale() / 10;
const px = scale() / 7.5;
const radius = px / 4;
const highlightScaling = radius / 100;

let value;
var sprite;
var isChosen;
var x;
var y;

class Stone {

    constructor(value, x, y, app, turnHandler) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.isChosen = false;

        createSprite(app, turnHandler);
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

        this.sprite = new PIXI.sprite(
            PIXI.loader.resources[path].texture
        );

        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.x = padding + this.x * px;
        sprite.y = padding + this.y * px;
        sprite.width = radius * 2;
        sprite.height = radius * 2;

        sprite.on('pointerdown', function(turnHandler) {
            turnHandler.spriteClicked(this)
        }).bind(this);

        app.stage.addChild(sprite);
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

    set value(value) {
        if (this.value === value) {
            return;
        }

        this.value = value;
        
        updateSprite();
    }

    updateSpriteCoordinates(stone) {
        stone.sprite.x = padding + stone.x * px;
        stone.sprite.x = padding + stone.y * px;
    }

    updateSprite() {
        if (this.value === 0) {
            this.sprite.texture = PIXI.loader.resources["images/whiteCircle64.png"].texture;
        } else if (this.value === 1) {
            this.sprite.texture = PIXI.loader.resources["images/redCircle64.png"].texture;
        } else if (this.value === -1) {
            this.sprite.texture = PIXI.loader.resources["images/blueCircle64.png"].texture;
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