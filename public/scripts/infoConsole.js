global.appendWithNewLineIfNecessery = function() {
    if (!document.getElementById("info").value == '') {
        document.getElementById("info").append("\n"); 
    }
};

global.printLine = function(line) {
    appendWithNewLineIfNecessery();
    document.getElementById("info").append(line);
};

global.clearInfoConsole = function() {
    document.getElementById("info").value = '';
};

global.newRoundToConsole = function() {
    appendWithNewLineIfNecessery();
    document.getElementById("info").append("\nNew Round!\n");
};

