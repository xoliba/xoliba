
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
        this.appendWithNewLineIfNecessery();
        document.getElementById("info").append("\nNew Round! Do you want to surrender or start the round?\n");
        this.scrollToBottom();
    }

    scrollToBottom(){
        let psconsole = $('#info');
        if(psconsole.length){
            psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
        }
    }
}

export { InfoConsole };
