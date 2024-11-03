const BlessedTerminal = require("./BlessedTerminal");

class StdoutTerminal {
	constructor() {
		if (StdoutTerminal.instance)
			throw new Error("StdoutTerminal is a singleton");
		StdoutTerminal.instance = this;

		this.terminal = BlessedTerminal.getInstance();

		this.isProcessingOutput = false;

		// Guardar las referencias originales
		this.originalStdout = process.stdout.write.bind(process.stdout);
		this.originalStderr = process.stderr.write.bind(process.stderr);
		this.originalConsoleLog = console.log.bind(console);
		this.originalConsoleError = console.error.bind(console);
		this.originalConsoleWarn = console.warn.bind(console);
		this.originalConsoleInfo = console.info.bind(console);

		this.capture_stdout();
	}

	capture_stdout() {
		// Capturar process.stdout.write
		const stdoutWrite = (...args) => {
			if (this.isProcessingOutput) {
				return this.originalStdout(...args);
			}

			this.isProcessingOutput = true;
			const text = String(args[0]);
			if (
				text.trim() &&
				!text.includes("\u001b[") &&
				!text.includes("[blessed]")
			) {
				this.terminal.add_line(text);
			}
			const result = this.originalStdout(...args);
			this.isProcessingOutput = false;
			return result;
		};

		// Capturar process.stderr.write
		const stderrWrite = (...args) => {
			if (this.isProcessingOutput) {
				return this.originalStderr(...args);
			}

			this.isProcessingOutput = true;
			const text = String(args[0]);
			if (
				text.trim() &&
				!text.includes("\u001b[") &&
				!text.includes("[blessed]")
			) {
				this.terminal.add_line(text);
			}
			const result = this.originalStderr(...args);
			this.isProcessingOutput = false;
			return result;
		};

		process.stdout.write = stdoutWrite.bind(process.stdout);
		process.stderr.write = stderrWrite.bind(process.stderr);

		// Capturar console methods
		console.log = this.createConsoleWrapper(
			console.log,
			this.originalConsoleLog
		);
		console.error = this.createConsoleWrapper(
			console.error,
			this.originalConsoleError
		);
		console.warn = this.createConsoleWrapper(
			console.warn,
			this.originalConsoleWarn
		);
		console.info = this.createConsoleWrapper(
			console.info,
			this.originalConsoleInfo
		);
	}

	createConsoleWrapper(fn, originalFn) {
		return (...args) => {
			if (this.isProcessingOutput) {
				return originalFn(...args);
			}

			this.isProcessingOutput = true;
			const text = args
				.map((arg) =>
					typeof arg === "object"
						? JSON.stringify(arg, null, 2)
						: String(arg)
				)
				.join(" ");

			if (
				text.trim() &&
				!text.includes("\u001b[") &&
				!text.includes("[blessed]")
			) {
				this.terminal.add_line(text);
			}
			const result = originalFn(...args);
			this.isProcessingOutput = false;
			return result;
		};
	}

	destroy() {
		if (process.stdout.write === this.originalStdout) return;

		process.stdout.write = this.originalStdout;
		process.stderr.write = this.originalStderr;
		console.log = this.originalConsoleLog;
		console.error = this.originalConsoleError;
		console.warn = this.originalConsoleWarn;
		console.info = this.originalConsoleInfo;
	}

	static getInstance() {
		if (!StdoutTerminal.instance) return new StdoutTerminal();
		return StdoutTerminal.instance;
	}

	static resetInstance() {
		if (StdoutTerminal.instance) {
			StdoutTerminal.instance.destroy();
			StdoutTerminal.instance = null;
		}
	}
}

module.exports = StdoutTerminal;
