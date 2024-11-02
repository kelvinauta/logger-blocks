const blessed = require('blessed');

class Terminal {
    constructor() {
        if (Terminal.instance) {
            throw new Error('Terminal ya está instanciada. Use Terminal.getInstance()');
        }

        // Crear pantalla principal
        this.screen = blessed.screen({
            smartCSR: true,
            title: 'Tuki Logger'
        });

        // Panel superior (logs)
        this.logsBox = blessed.box({
            top: '0',
            left: '0',
            width: '100%',
            height: '70%',
            label: ' Logs ',
            border: {
                type: 'line'
            },
            // Configuración para soportar códigos ANSI (chalk)
            tags: true,
            ansi: true,
            scrollable: true,
            alwaysScroll: true,
            mouse: true,
            keys: true,
            vi: true,
            scrollbar: {
                ch: '█',
                track: {
                    bg: 'cyan'
                },
                style: {
                    inverse: true
                }
            },
            wrap: true,
            scrollback: 1000
        });

        // Panel inferior (status)
        this.statusBox = blessed.box({
            top: '70%',
            left: '0',
            width: '100%',
            height: '30%',
            label: ' Status ',
            border: {
                type: 'line'
            },
            // Configuración para soportar códigos ANSI (chalk),
            ansi: true,
            content: ''
        });

        // Añadir boxes a la pantalla
        this.screen.append(this.logsBox);
        this.screen.append(this.statusBox);

        // Manejar salida
        this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

        // Habilitar scroll con teclas
        this.logsBox.key(['up'], () => this.logsBox.scroll(-1));
        this.logsBox.key(['down'], () => this.logsBox.scroll(1));
        this.logsBox.key(['pageup'], () => this.logsBox.scroll(-this.logsBox.height));
        this.logsBox.key(['pagedown'], () => this.logsBox.scroll(this.logsBox.height));

        // Renderizar pantalla inicial
        this.screen.render();

        // Marcar esta instancia como la única
        Terminal.instance = this;
    }

    add_line(text) {
        // Añadir nueva línea al panel de logs
        const currentContent = this.logsBox.getContent();
        this.logsBox.setContent(currentContent + 
            (currentContent ? '\n' : '') + text);
        
        // Scroll al final
        this.logsBox.setScrollPerc(100);
        this.screen.render();
    }

    update_status(text) {
        // Actualizar contenido del panel de status
        this.statusBox.setContent(text);
        this.screen.render();
    }

    // Método para obtener la instancia singleton
    static getInstance() {
        if (!Terminal.instance) {
            Terminal.instance = new Terminal();
        }
        return Terminal.instance;
    }

    // Método para testing
    static resetInstance() {
        Terminal.instance = null;
    }
}

module.exports = Terminal; 