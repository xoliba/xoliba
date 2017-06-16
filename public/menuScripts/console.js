var currentRatio;

function hideConsole(){
    var element = document.getElementById("infoDiv");
    var button = document.getElementById("showConsoleDiv");

    element.style.transition = '0.5s';
    element.style.left = '105vw';
    setTimeout(() => {
        element.style.transition = '0s';
        button.style.transition = '0.5s';
        button.style.left = '96%';
        setTimeout(() => {
            button.style.transition = '0s';
        }, 500);
    }, 500);
}

function showConsole(){
    var element = document.getElementById("infoDiv");
    var button = document.getElementById("showConsoleDiv");

    button.style.transition = '0.5s';
    button.style.left = '100vw';
    setTimeout(() => {
        button.style.transition = '0s';
        element.style.transition = '0.5s';
        element.style.left = '80vw';
        setTimeout(() => {
            element.style.transition = '0s';
        }, 500);
    }, 500);
}

function hideConsoleDown(){
    var element = document.getElementById("infoDiv");
    var button = document.getElementById("showConsoleDiv");

    element.style.transition = '0.5s';
    element.style.top = '100%';
    setTimeout(() => {
        element.style.transition = '0s';
        button.style.transition = '0.5s';
        button.style.top = '95%';
        setTimeout(() => {
            button.style.transition = '0s';
        }, 500);
    }, 500);
}

function showConsoleUp(){
    var element = document.getElementById("infoDiv");
    var button = document.getElementById("showConsoleDiv");

    button.style.transition = '0.5s';
    button.style.top = '100%';
    setTimeout(() => {
        button.style.transition = '0s';
        element.style.transition = '0.5s';
        element.style.top = '69%';
        setTimeout(() => {
            element.style.transition = '0s';
        }, 500);
    }, 500);
}

$(window).resize(function(){
    var ratio = $(window).width() / $(window).height();
    if(currentRatio === undefined){
        if (ratio > 3/2) {
            currentRatio = 1;
        } else {
            currentRatio = 2;
        }
    }
    if(currentRatio > 3/2 && ratio > 3/2){
        currentRatio = 1;
        $('.console').attr('style', '');
    } else if (currentRatio < 3/2 && ratio < 3/2){
        currentRatio = 2;
        $('.console').attr('style', '');
    }
});
