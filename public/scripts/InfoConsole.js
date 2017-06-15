
class InfoConsole {

    appendWithNewLineIfNecessery() {
        if (!document.getElementById("info").value == '') {
            document.getElementById("info").append("\n");
        }
    }

    printLine(line) {
        this.appendWithNewLineIfNecessery();
        document.getElementById("info").append(line);
        this.scrollToBottom();
    }

    clearInfoConsole() {
        document.getElementById("info").value = '';
    }

    newRoundToConsole() {
        this.printLine("\nNew Round! Do you want to surrender or start the round?\n");
    }

    startMessage() {
        this.printLine("\nWelcome to Xoliba! Do you want to surrender or start the round?\n");
    }

    scrollToBottom(){
        let psconsole = $('#info');
        if(psconsole.length){
            psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
        }
    }

    printMove(start, target, corner2, corner3, ateEnemies, ateOwns) {
        let eatedStonesString = '';
        if(ateEnemies.length > 0 || ateOwns.length > 0) {
            eatedStonesString += " (";
            for(let i=0; i<ateEnemies.length; i++) {
                eatedStonesString += this.turnIntoCoordinates(ateEnemies[i]);
                if(i<ateEnemies.length-1) eatedStonesString += " ";
            }
            if(ateOwns.length > 0) {
                eatedStonesString += "; ";
                for(let i=0; i<ateOwns.length; i++) {
                    eatedStonesString += this.turnIntoCoordinates(ateOwns[i]);
                    if(i<ateOwns.length-1) eatedStonesString += " ";
                }
            }
            eatedStonesString += ")";
        }
        this.printLine(" " + this.turnIntoCoordinates(start)+ "-" + this.turnIntoCoordinates(target)+ eatedStonesString);
    }

    turnIntoCoordinates(coordinates) {
        return String.fromCharCode(65 + coordinates[0]) + coordinates[1];
    }

}

export { InfoConsole };
