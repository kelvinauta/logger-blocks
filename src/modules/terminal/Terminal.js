const BlessedTerminal = require('./BlessedTerminal');
const StdoutTerminal = require('./StdoutTerminal');

class Terminal {
    constructor() {
        if (Terminal.instance) {
            throw new Error('Terminal ya está instanciada. Use Terminal.getInstance()');
        }

        this.blessed = BlessedTerminal.getInstance();
        this.stdout = StdoutTerminal.getInstance();
        
        Terminal.instance = this;
    }

    add_line(text) {
        this.blessed.add_line(text);
    }

    update_status(text) {
        this.blessed.update_status(text);
    }

    destroy() {
        StdoutTerminal.resetInstance();
        BlessedTerminal.resetInstance();
        Terminal.instance = null;
    }

    static getInstance() {
        if (!Terminal.instance) {
            Terminal.instance = new Terminal();
        }
        return Terminal.instance;
    }

    static resetInstance() {
        if(Terminal.instance) {
            Terminal.instance.destroy();
        }
    }

    static init() {
        const terminal = Terminal.getInstance();
        
        process.on('exit', () => {
            terminal.destroy();
        });

        process.on('SIGINT', () => {
            terminal.destroy();
            process.exit();
        });

        return terminal;
    }
}

module.exports = Terminal;