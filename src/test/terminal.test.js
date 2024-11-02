const Terminal = require('../modules/terminal.js');

async function testTerminal() {
    const terminal = Terminal.getInstance();

    // Test 1: Logs con diferentes colores
    terminal.add_line('=== Test 1: Logs con Colores ===');
    terminal.add_line('Este es un mensaje normal', 'normal');
    terminal.add_line('Este es un mensaje de error', 'error');
    terminal.add_line('Este es un mensaje de advertencia', 'warning');
    terminal.add_line('Este es un mensaje de éxito', 'success');
    terminal.add_line('Este es un mensaje de información', 'info');
    terminal.add_line('Este es un mensaje de debug', 'debug');

    // Test 2: Status con diferentes colores
    await new Promise(resolve => setTimeout(resolve, 1000));
    terminal.add_line('\n=== Test 2: Status con Colores ===');
    
    await new Promise(resolve => {
        let states = [
            { text: 'Estado normal...', type: 'normal' },
            { text: 'Procesando...', type: 'info' },
            { text: '¡Advertencia!', type: 'warning' },
            { text: '¡Error detectado!', type: 'error' },
            { text: '¡Operación exitosa!', type: 'success' },
            { text: 'Debugging...', type: 'debug' }
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i >= states.length) {
                clearInterval(interval);
                resolve();
                return;
            }
            
            const state = states[i];
            terminal.update_status(state.text, state.type);
            terminal.add_line(`Cambiando estado a: ${state.text}`, state.type);
            i++;
        }, 1000);
    });

    // Mensaje final
    terminal.add_line('\n=== Pruebas Completadas ===', 'success');
    terminal.update_status('✅ Todas las pruebas finalizadas. Presiona Q para salir.', 'success');
}

// Ejecutar las pruebas
testTerminal().catch(error => {
    console.error('Error en las pruebas:', error);
    process.exit(1);
}); 