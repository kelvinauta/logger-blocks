const LOGGER = require('./src/modules/logger.js');

// Crear una instancia del logger
const logger = new LOGGER({
    title: "Test Logger",
    description: "Prueba de funcionalidad del logger",
    prefix: "🔍",
    timeout: 5000 // 5 segundos para demostrar el auto end_block
});

// Función asíncrona para simular algunas operaciones
async function testLogger() {
    // Primer bloque de logs
    logger
        .info("Iniciando prueba del logger")
        .warn("Esto es una advertencia")
        .success("Operación completada exitosamente")
        .end("Primer bloque finalizado", "success");

    // Segundo bloque de logs con objeto JSON
    const testData = {
        usuario: "test",
        acción: "login",
        timestamp: new Date()
    };

    logger
        .info("Iniciando segundo bloque")
        .json(testData)
        .error("Ocurrió un error en el proceso")
        .end("Segundo bloque finalizado", "error");

    // Tercer bloque que usará el timeout automático
 

    // setTimeout(() => {
    //     console.log("Tercer bloque finalizado");
    // }, 10000);
}

// Ejecutar las pruebas
testLogger();
