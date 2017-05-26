import * as PIXI from 'pixi.js';

function drawTable(stage) {
    let graphics = new PIXI.Graphics();
    var size = scale();

    drawLines(stage, size, graphics);

    stage.addChild(graphics)
}

function scale() {
    var x = window.innerWidth;
    var y = window.innerHeight;

    var result = Math.min(x, y);
    return result;
}

function drawLines(stage, size, graphics) {
    //Dont touch these :)
    var padding = size / 10;
    var rectSideLength = (size - 2 * padding) / 6;
    var center = size / 2;
    var lineWidth = size / 80;
    var thinLine = 0.5 * lineWidth;
    var i;

    for (var i = -2; i <= 2; i++) {
        graphics.lineStyle(lineWidth, 0x000000).moveTo(center + i * rectSideLength, center + -3 * rectSideLength).lineTo(center + i * rectSideLength, center + 3 * rectSideLength);
        graphics.lineStyle(lineWidth, 0x000000).moveTo(center + -3 * rectSideLength, center + i * rectSideLength).lineTo(center + 3 * rectSideLength, center + i * rectSideLength);
        graphics.lineStyle(thinLine, 0x000000).moveTo(center + i * rectSideLength, center - 3 * rectSideLength).lineTo(center + 3 * rectSideLength, center - i * rectSideLength);
        graphics.lineStyle(thinLine, 0x000000).moveTo(center - 3 * rectSideLength, center + i * rectSideLength).lineTo(center + i * rectSideLength, center - 3 * rectSideLength);
        graphics.lineStyle(thinLine, 0x000000).moveTo(center - 3 * rectSideLength, center + i * rectSideLength).lineTo(center - i * rectSideLength, center + 3 * rectSideLength);
        graphics.lineStyle(thinLine, 0x000000).moveTo(center + i * rectSideLength, center + 3 * rectSideLength).lineTo(center + 3 * rectSideLength, center + i * rectSideLength);

    }

    graphics.lineStyle(lineWidth, 0x000000).moveTo(center + 3 * rectSideLength, center + 2 * rectSideLength).lineTo(center + 2 * rectSideLength, center + 3 * rectSideLength);
    graphics.lineStyle(lineWidth, 0x000000).moveTo(center + 3 * rectSideLength, center - 2 * rectSideLength).lineTo(center + 2 * rectSideLength, center - 3 * rectSideLength);
    graphics.lineStyle(lineWidth, 0x000000).moveTo(center - 3 * rectSideLength, center + 2 * rectSideLength).lineTo(center - 2 * rectSideLength, center + 3 * rectSideLength);
    graphics.lineStyle(lineWidth, 0x000000).moveTo(center - 3 * rectSideLength, center - 2 * rectSideLength).lineTo(center - 2 * rectSideLength, center - 3 * rectSideLength);

    graphics.lineStyle(lineWidth, 0x000000).moveTo(center + 3 * rectSideLength, center + 2 * rectSideLength).lineTo(center + 3 * rectSideLength, center - 2 * rectSideLength);
    graphics.lineStyle(lineWidth, 0x000000).moveTo(center + 2 * rectSideLength, center + 3 * rectSideLength).lineTo(center - 2 * rectSideLength, center + 3 * rectSideLength);
    graphics.lineStyle(lineWidth, 0x000000).moveTo(center - 3 * rectSideLength, center + 2 * rectSideLength).lineTo(center - 3 * rectSideLength, center - 2 * rectSideLength);
    graphics.lineStyle(lineWidth, 0x000000).moveTo(center + 2 * rectSideLength, center - 3 * rectSideLength).lineTo(center - 2 * rectSideLength, center - 3 * rectSideLength);

    graphics.lineStyle(thinLine, 0x000000).moveTo(center + 2 * rectSideLength, center + 2 * rectSideLength).lineTo(center - 2 * rectSideLength, center - 2 * rectSideLength);
    graphics.lineStyle(thinLine, 0x000000).moveTo(center - 2 * rectSideLength, center + 2 * rectSideLength).lineTo(center + 2 * rectSideLength, center - 2 * rectSideLength);
}

export { scale, drawTable };