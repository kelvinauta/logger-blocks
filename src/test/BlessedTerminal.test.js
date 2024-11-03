const BlessedTerminal = require('../modules/terminal/BlessedTerminal');

async function testBlessedTerminal() {
    const terminal = BlessedTerminal.getInstance();
    
    terminal.add_line('Este es un mensaje de debug', 'debug');
    terminal.add_line('Este es un mensaje de info', 'info');
    terminal.add_line('Este es un mensaje de warn', 'warn');
    terminal.add_line('Este es un mensaje de error', 'error');
    terminal.update_status('Este es un mensaje de status');

    terminal.add_line('Este es un mensaje de error2', 'error');
}

testBlessedTerminal();