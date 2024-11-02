const Terminal = require('../modules/terminal.js');

function testSingleton() {
    console.log('=== Test Singleton Pattern ===');

    // Test 1: Crear primera instancia
    try {
        const terminal1 = new Terminal();
        console.log('❌ Error: Se permitió crear una instancia directamente');
    } catch (error) {
        console.log('✅ Test 1: No se permite crear instancia directamente');
    }

    // Test 2: Obtener instancia mediante getInstance
    try {
        const terminal2 = Terminal.getInstance();
        console.log('✅ Test 2: getInstance funciona correctamente');
    } catch (error) {
        console.log('❌ Error en getInstance:', error.message);
    }

    // Test 3: Verificar que no se pueden crear múltiples instancias
    try {
        const terminal3 = new Terminal();
        console.log('❌ Error: Se permitió crear múltiples instancias');
    } catch (error) {
        console.log('✅ Test 3: No se permiten múltiples instancias');
    }

    // Test 4: Verificar que getInstance siempre devuelve la misma instancia
    const instance1 = Terminal.getInstance();
    const instance2 = Terminal.getInstance();
    
    if (instance1 === instance2) {
        console.log('✅ Test 4: getInstance devuelve la misma instancia');
    } else {
        console.log('❌ Error: getInstance devuelve diferentes instancias');
    }

    // Limpiar para otros tests
    Terminal.resetInstance();
    
    console.log('\nTests completados. Presiona Q para salir.');
}

// Ejecutar tests
testSingleton(); 