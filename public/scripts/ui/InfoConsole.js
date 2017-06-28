let aiHasBeenThinkingFor;
let valueWithoutLastLine;
let lastLine;

class InfoConsole {

    constructor() {
        this.aiHasBeenThinking = 0;
        this.valueWithoutLastLine = '';
        this.lastLine = '';
    }

    appendWithNewLineIfNecessery() {
        // == instead of === is intended.
        if (!document.getElementById("info").value == '') {
            document.getElementById("info").value += "\n";
        }
    }

    printLine(line) {
        this.appendWithNewLineIfNecessery();
        document.getElementById("info").value += line;
        this.scrollToBottom();
    }

    printAiIsThinking(firstPrint, howLong) {
        this.aiHasBeenThinking = howLong;
        if (firstPrint) {
            this.valueWithoutLastLine = document.getElementById("info").value;
        }
        this.lastLine = "\nAI is thinking (" + this.aiHasBeenThinking + "s)";
        document.getElementById("info").value = this.valueWithoutLastLine + this.lastLine;
        this.scrollToBottom();
    }

    clearInfoConsole() {
        document.getElementById("info").value = '';
    }

    scrollToBottom(){
        let psconsole = $('#info');
        if (psconsole.length){
            psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());
        }
    }

}

export { InfoConsole };
