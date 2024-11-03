const StdoutTerminal = require('../modules/terminal/StdoutTerminal');

async function testStdoutTerminal() {
    const stdoutTerminal = StdoutTerminal.getInstance();
    console.log("stdoutTerminal");
    // console
}

testStdoutTerminal();