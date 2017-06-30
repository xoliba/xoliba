$(window).resize(function() {
    positionCoordinatesBasedOnWindowLayout();
});

function positionCoordinatesBasedOnWindowLayout(){
    var ratio = $(window).width() / $(window).height();
    var canvasSize = $('#gameboard').width();
    if(ratio > 5/3){
        resetCSS();
    } else {
        let left = ($(window).width() - canvasSize) / 2 + 0.02 * canvasSize;
        let top = $(window).height() * 0.2 + canvasSize * 0.95;
        repositionCoordinates(left, top, canvasSize);
    }
}

function repositionCoordinates(left, top, canvasSize){
    for (var i = 0; i < 7; i++) {
        document.getElementsByClassName('yCoordinate')[i].style.left = '' + left + 'px';
        document.getElementsByClassName('xCoordinate')[i].style.top = '' + top + 'px';
    }
    for (var i = 0; i < 7; i++) {
        document.getElementsByClassName('yCoordinate')[i].style.top = '' + (top - canvasSize * 0.86 + i * canvasSize * 0.132) + 'px';
        document.getElementsByClassName('xCoordinate')[i].style.left = '' + (left + canvasSize * 0.08 + i * canvasSize * 0.132) + 'px';
    }
}

function resetCSS(){
    $('.yCoordinates').attr('style', '');
    $('.xCoordinates').attr('style', '');
    let yid = 'y';
    let xid = 'x';
    for (var i = 0; i < 7; i++) {
        document.getElementsByClassName('yCoordinate')[i].style.left = '26vw';
        document.getElementsByClassName('xCoordinate')[i].style.top = '47.5vw';
        $('#y' + (1 + i)).attr('style', '');
        $('#x' + (1 + i)).attr('style', '');
    }

}
