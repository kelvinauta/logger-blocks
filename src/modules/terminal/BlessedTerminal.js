const blessed = require('blessed');

class BlessedTerminal {
    constructor() {
        if(BlessedTerminal.instance) throw new Error('BlessedTerminal is a singleton');
        BlessedTerminal.instance = this;

        this.initScreen();
    }

    initScreen() {
        this.screen = blessed.screen({
            smartCSR: true,
            title: 'Tuki Logger'
        });

        this.logsBox = blessed.box({
            top: '0',
            left: '0',
            width: '100%',
            height: '70%',
            label: ' Logs ',
            border: { type: 'line' },
            tags: true,
            ansi: true,
            scrollable: true,
            alwaysScroll: true,
            mouse: true,
            keys: true,
            vi: true,
            scrollbar: {
                ch: '█',
                track: { bg: 'cyan' },
                style: { inverse: true }
            },
            wrap: true,
            scrollback: 1000
        });

        this.statusBox = blessed.box({
            top: '70%',
            left: '0',
            width: '100%',
            height: '30%',
            label: ' Status ',
            border: { type: 'line' },
            ansi: true,
            content: ''
        });

        this.screen.append(this.logsBox);
        this.screen.append(this.statusBox);
        this.setupKeyHandlers();
        
        this.screen.render();
    }

    static getInstance() {
        if(!BlessedTerminal.instance) {
            return new BlessedTerminal();
        }
        return BlessedTerminal.instance;
    }

    static resetInstance() {
        if(BlessedTerminal.instance) {
            BlessedTerminal.instance.destroy();
            BlessedTerminal.instance = null;
        }
    }

    setupKeyHandlers() {
        this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
        this.logsBox.key(['up'], () => this.logsBox.scroll(-1));
        this.logsBox.key(['down'], () => this.logsBox.scroll(1));
        this.logsBox.key(['pageup'], () => this.logsBox.scroll(-this.logsBox.height));
        this.logsBox.key(['pagedown'], () => this.logsBox.scroll(this.logsBox.height));
    }

    add_line(text) {
        const currentContent = this.logsBox.getContent();
        this.logsBox.setContent(currentContent + 
            (currentContent ? '\n' : '') + text);
        
        this.logsBox.setScrollPerc(100);
        this.screen.render();
    }

    update_status(text) {
        this.statusBox.setContent(text);
        this.screen.render();
    }

    destroy() {
        if(this.screen) {
            this.screen.destroy();
        }
    }
}

module.exports = BlessedTerminal; 