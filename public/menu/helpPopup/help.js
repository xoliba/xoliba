var popup = document.getElementById("help");
var dragger = document.getElementById("dragger");

function closeHelp(){
    document.getElementById('help').style.display = 'none';
}

function openHelp(){
    var element = document.getElementById('help');
    element.style.display = 'block';
}

dragger.onmousedown = function(event) {

    dragger.style.cursor = 'grabbing';

    let shiftX = event.clientX - popup.getBoundingClientRect().left;
    let shiftY = event.clientY - popup.getBoundingClientRect().top;

    popup.style.position = 'absolute';
    popup.style.zIndex = 1000;
    document.body.append(popup);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        popup.style.left = pageX - shiftX + 'px';
        popup.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    popup.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        dragger.style.cursor = 'grab';
        dragger.onmouseup = null;
    };

};

dragger.ondragstart = function() {
  return false;
};
