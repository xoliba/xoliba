import * as PIXI from 'pixi.js';
import { scale } from './Draw.js';

const padding = scale() / 10;
const px = scale() / 7.5;
const radius = px / 4;

var value;
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
}