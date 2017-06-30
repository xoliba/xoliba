function openNewGamePopUp(){
    closeNav();
    let radios = document.getElementsByName("mode");
    let gameMode;
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            gameMode = radios[i].value;
            break;
        }
    }
    console.log("open new game pop up, game mode: " + gameMode);
    if (gameMode === 'play') {
        document.getElementById("newWatchGamePopUp").style.display = 'block';
    } else {
        document.getElementById("newGamePopUp").style.display = 'block';
    }
}

function closeNewGamePopUp(){
    document.getElementById("newGamePopUp").style.display = 'none';
}
