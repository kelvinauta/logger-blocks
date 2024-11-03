const Terminal = require('../modules/terminal');

async function testTerminal() {
    const terminal = Terminal.getInstance();
    
    // Probando add_line
    terminal.add_line('Este es un mensaje de debug', 'debug');
    terminal.add_line('Este es un mensaje de info', 'info');
    terminal.add_line('Este es un mensaje de warn', 'warn');
    terminal.add_line('Este es un mensaje de error', 'error');
    // Probando update_status
    const interval = setInterval(() => {
        terminal.update_status('Este es un mensaje de status');
        setTimeout(() => {
            clearInterval(interval);
        }, 1000*5);
    }, 1000);

    // Probando Logs
    console.log("Estos son los logs: ");
    console.log({
        test: "test",
        test2: "test2",
        test3: "test3"
    });
    console.error("Este es un mensaje de error");
}

testTerminal();