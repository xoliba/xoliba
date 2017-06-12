global.printLine = function(line) {
    if(!document.getElementById("info").value == '') document.getElementById("info").append("\n");
    document.getElementById("info").append(line);
}
