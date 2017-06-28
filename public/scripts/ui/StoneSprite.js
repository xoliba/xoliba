import * as PIXI from 'pixi.js';
import { scale } from './Draw.js';

const padding = scale() / 10;
const px = scale() / 7.5;
const radius = px / 4;
const highlightScaling = radius / 200;
var newX;
var newY;


let sprite;
let pixiApp;
PIXI.loader.add([
    "images/whiteCircle128.png",
    "images/blueCircle128.png",
    "images/redCircle128.png"
]).load();
class StoneSprite {

    constructor(x, y, app, turnHandler, parent) {
        this.pixiApp = app;
        if (parent.value === -1) {
            this.sprite = new PIXI.Sprite.fromImage('/images/blueCircle128.png');
            //path = "images/blueCircle64.png";
        } else if (parent.value === 0) {
            this.sprite = new PIXI.Sprite.fromImage('/images/whiteCircle128.png');
            //path = "images/whiteCircle64.png";
        } else if (parent.value === 1) {
            this.sprite = new PIXI.Sprite.fromImage('/images/redCircle128.png');
            //path = "images/redCircle64.png";
        }

        /*this.sprite = new PIXI.Sprite(
            PIXI.loader.resources[path].texture
        );*/

        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.x = padding + x * px;
        this.sprite.y = padding + y * px;
        this.sprite.width = radius * 2;
        this.sprite.height = radius * 2;

        this.sprite.on('pointerdown', () => {
            turnHandler.spriteClicked(parent);
        });

        app.stage.addChild(this.sprite);
    }

    enlarge() {
        this.sprite.scale.x += highlightScaling;
        this.sprite.scale.y += highlightScaling;
    }

    minimize() {
        this.sprite.scale.x -= highlightScaling;
        this.sprite.scale.y -= highlightScaling;
    }

    updateColor(newVal) {
        if (newVal === 0) {
            this.sprite.texture = PIXI.loader.resources["images/whiteCircle128.png"].texture;
        } else if (newVal === 1) {
            this.sprite.texture = PIXI.loader.resources["images/redCircle128.png"].texture;
        } else if (newVal === -1) {
            this.sprite.texture = PIXI.loader.resources["images/blueCircle128.png"].texture;
        }
    }

    animateStone() {
        var velocity = px / 5;
        if (this.newX > this.sprite.x) {
            this.sprite.x += velocity;
        } else if (this.newX < this.sprite.x) {
            this.sprite.x -= velocity;
        }
        if (this.newY > this.sprite.y) {
            this.sprite.y += velocity;
        } else if (this.newY < this.sprite.y) {
            this.sprite.y -= velocity;
        }
        if (Math.abs(this.newX - this.sprite.x) < velocity && Math.abs(this.newY - this.sprite.y) < velocity) {
            this.sprite.x = this.newX;
            this.sprite.y = this.newY;
            this.pixiApp.ticker.remove(this.animateStone, this);
        }
    }


    updateCoordinates(x, y) {
        this.newX = padding + x * px;
        this.newY = padding + y * px;
        this.pixiApp.ticker.add(this.animateStone, this);
        //    this.sprite.x = padding + x * px;
        //     this.sprite.y = padding + y * px;
    }
}

export { StoneSprite };
