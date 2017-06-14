function hideConsole(){
    var element = document.getElementById("infoDiv");
    var button = document.getElementById("showConsoleDiv");

    element.style.transition = '0.5s';
    element.style.left = '100vw';
    setTimeout(() => {
        element.style.transition = '0s';
        button.style.transition = '0.5s';
        button.style.left = '96vw';
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
