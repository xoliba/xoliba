function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function getAIdifficulty() {
    let radios = document.getElementsByName("difficulty");
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return (radios[i].value);
        }
    }
}
