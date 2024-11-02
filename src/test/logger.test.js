const LOGGER = require('../index.js');

// Ejemplo 1: Logger básico con timeout corto
console.log("\n=== Test 1: Logger básico ===");
const logger1 = new LOGGER({
    title: "Logger Básico",
    timeout: 3000
});

logger1
    .info("Iniciando prueba básica")
    .warn("Esto es una advertencia de prueba")
    .error("Simulando un error")
    .success("Operación completada")
    .end("Fin de prueba básica", "success");

// Ejemplo 2: Logger con objetos JSON
console.log("\n=== Test 2: Logger con JSON ===");
const logger2 = new LOGGER({
    title: "Logger JSON",
    timeout: 3000
});

const dataPrueba = {
    usuario: "admin",
    acción: "login",
    timestamp: new Date(),
    metadata: {
        ip: "192.168.1.1",
        navegador: "Chrome"
    }
};

logger2
    .info("Iniciando prueba con JSON")
    .json(dataPrueba)
    .success("Datos procesados correctamente")
    .end("Fin de prueba JSON", "info");

// Ejemplo 3: Logger con timeout automático
console.log("\n=== Test 3: Logger con timeout ===");
const logger3 = new LOGGER({
    title: "Logger Timeout",
    timeout: 2000
});

logger3
    .info("Este bloque se cerrará automáticamente")
    .warn("Esperando 2 segundos...")
    .silly("Mensaje tonto mientras esperamos");

// Ejemplo 4: Logger sin guardado
console.log("\n=== Test 4: Logger sin guardado ===");
const logger4 = new LOGGER({
    title: "Logger Sin Guardar",
    save: false,
    timeout: 3000
});

logger4
    .info("Estos logs solo se mostrarán en consola")
    .warn("No se guardarán en archivo")
    .end("Fin de prueba sin guardado", "info");

// Ejemplo 5: Logger con múltiples mensajes
console.log("\n=== Test 5: Logger múltiples mensajes ===");
const logger5 = new LOGGER({
    title: "Logger Múltiple",
    timeout: 3000,
    colorize: false,
});

logger5
    .info("Primer mensaje", "Segundo mensaje", "Tercer mensaje")
    .warn("Advertencia 1", "Advertencia 2")
    .end("Fin de prueba múltiple", "success");


const logger6 = new LOGGER({
    title: "Logger finalizado antes del timeout",
    timeout: 10000
});

logger6.info("Esperando sólo 3 segundos");
setTimeout(() => {
    logger6.end("Fin de prueba con timeout", "info");
}, 3000);
