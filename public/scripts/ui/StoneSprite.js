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

    animateStone(x, y) {
        if (x > this.sprite.x) {
            this.sprite.x += 8;
        } else if (x < this.sprite.x) {
            this.sprite.x -= 8;
        }
        if (y > this.sprite.y) {
            this.sprite.y += 8;
        } else if (y < this.sprite.y) {
            this.sprite.y -= 8;
        }
        if (Math.abs(x - this.sprite.x) < 6) {
            this.sprite.x = x;
            this.pixiApp.ticker.remove(this.animate);
        }
        if (Math.abs(y - this.sprite.y) < 6) {
            this.sprite.y = y;
            this.pixiApp.ticker.remove(this.animate);
        }
    }

    animate() {
        this.animateStone(this.newX, this.newY);
    }

    updateCoordinates(x, y) {
        this.newX = padding + x * px;
        this.newY = padding + y * px;
        this.animateStone(newX, newY);
        this.pixiApp.ticker.add((animate) => {
            this.animateStone(this.newX, this.newY)
        });
        //    this.sprite.x = padding + x * px;
        //     this.sprite.y = padding + y * px;
    }
}

export { StoneSprite };
