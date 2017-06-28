import * as PIXI from 'pixi.js';

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

    for (i = -2; i <= 2; i++) {
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

function writeCoords(stage, size, graphics) {
    var padding = size / 10;
    var center = size / 2;
    var rectSideLength = (size - 2 * padding) / 6;
    var j = -2;
    for (let i = 3; i >= -3; i--) {
        var n = new PIXI.Text(String.fromCharCode(65 + (i + 3)), {fontFamily: 'Jura, sans-serif'});
        var m = new PIXI.Text(i + j, {fontFamily: 'Jura, sans-serif'});
        n.y = center + (3 * rectSideLength) + 30;
        n.x = center + (i * rectSideLength) - 10;
        m.y = center + (i * rectSideLength) - 18;
        m.x = center + (-3 * rectSideLength) - 50;
        graphics.addChild(n);
        graphics.addChild(m);
        j += 2;
    }
}

function drawTable(stage) {
    let graphics = new PIXI.Graphics();
    var size = scale();

    drawLines(stage, size, graphics);
    writeCoords(stage, size, graphics);

    stage.addChild(graphics);
}

export { scale, drawTable};
