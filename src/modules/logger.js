// TODO: Convertir este código en una librería que se pueda reutilizar en otros proyectos
const chalk = require("chalk");
const uuid = require("uuid");
const fs = require("fs-extra");
const Log = require("./log.js");

class LOGGER {
	constructor({
		title,
		save = true,
		base_path = "./.logs", 
      all_logs_path = "./.logs/all_logs.log", 
		timeout = 15000, // Tiempo por defecto para guardar un bloque de logs
      
      // TODO: Redundancia en Log.js
      mode = "terminal", // "terminal" or "console" 
      colorize = true, 
	}) {
		// Frequently user configuration
		this.title = title; // Nombre del logger
		this.save = save;
		this.timeout = timeout; // Tiempo de espera para guardar un bloque de logs
		this.base_path = base_path; // Ruta donde se guardará el log
		this.all_logs_path = all_logs_path; // Ruta donde se guardará el log de todos los logs
      this.mode = mode;
      this.colorize = colorize;
      
		// Default configuration
		this.id = uuid.v4(); // ID del logger
		this.separator = " | "; // Separador de logs
		this.separator_vertical = `------------------`; // Separador de bloques de logs

		// Private
		this.logs = []; // Logs en memoria
		this.path = this._build_path(); // Ruta del archivo de logs
      this.timer; // Temporizador
      this.time_start; // Tiempo de inicio
      this.time_end; // Tiempo de fin
	}

	// Public Methods
	log(...messages) {
		this._new_log(messages, "info");
		return this;
	}
	info(...messages) {
		this._new_log(messages, "info");
		return this;
	}
	warn(...messages) {
		this._new_log(messages, "warn");
		return this;
	}
	error(...messages) {
		this._new_log(messages, "error");
		return this;
	}
	success(...messages) {
		this._new_log(messages, "success");
		return this;
	}
	silly(...messages) {
		this._new_log(messages, "silly");
		return this;
	}
	json(...messages) {
		this._new_log(messages, "json");
		return this;
	}
	end(conclusion_log, conclusion_type) {
		this._end_log(conclusion_log, conclusion_type);
		return this;
	}

	// Setters
	Title(title) {
		this.title = title;
		return this;
	}
	Save(save) {
		this.save = save;
		return this;
	}
	Path(path) {
		this.path = path;
		return this;
	}
	Timeout(timeout) {
		this.timeout = timeout;
		return this;
	}

	// Private Method
   
   _save_logs_block(logs_block){
      // validate
      if(!this.path) throw new Error("Path is required");
      if(typeof this.path !== "string") throw new Error("Path must be a string");
      if(!this.logs) throw new Error("Logs are required");
      if(!Array.isArray(this.logs)) throw new Error("Logs must be an array");
      if(this.logs.length === 0) throw new Error("Logs must have at least one log");
      if(this.logs.some(log => !(log instanceof Log))) throw new Error("Logs must be an array of Log instances");

      // logic  
      const path_blocks = `${this.path}_blocks`;
      fs.appendFileSync(path_blocks, logs_block);
      return this;
   }
   _save_master_log(log){
      // validate
      if(!this.all_logs_path) throw new Error("all_logs_path is required");
      if(typeof this.all_logs_path !== "string") throw new Error("all_logs_path must be a string");
      if(!log) throw new Error("Log is required");
      if(!(log instanceof Log)) throw new Error("Log must be an instance of Log");  

      // logic
      log = `\n${log.get_log()}`;
      fs.ensureFileSync(this.all_logs_path);
      fs.appendFileSync(this.all_logs_path, log);
   }
   _build_logs_block(){
      // validate
      if(!this.logs) throw new Error("Logs are required");
      if(!Array.isArray(this.logs)) throw new Error("Logs must be an array");
      if(this.logs.length === 0) throw new Error("Logs must have at least one log");
      if(this.logs.some(log => !(log instanceof Log))) throw new Error("Logs must be an array of Log instances");
      if(!this.time_start) throw new Error("Time start is required");
      if(!this.time_end) throw new Error("Time end is required");
      if(!this.path) throw new Error("Path is required");
      if(typeof this.path !== "string") throw new Error("Path must be a string");   

      // logic
      const time_elapsed = this.time_end - this.time_start;
      let logs_block = "";
      logs_block+=`\n${this.separator_vertical}\n`;
      logs_block+=`=== ${this.title} ===\n`;
      logs_block+=`time_start: ${this.time_start}\n`;
      logs_block+=`time_end: ${this.time_end}\n`;
      logs_block+=`time_elapsed: ${time_elapsed}ms\n`;
      logs_block+=`\n`;
      logs_block+=this.logs.map(log => log.get_log()).join("\n");
      logs_block+=`\n${this.separator_vertical}\n`;
      return logs_block;
   }
   _end_log(conclusion_log, conclusion_type){
      // validate
      if(!conclusion_log) throw new Error("Conclusion log is required");
      if(typeof conclusion_log !== "string") throw new Error("Conclusion log must be a string");
      if(!conclusion_type) throw new Error("Conclusion type is required");
      if(typeof conclusion_type !== "string") throw new Error("Conclusion type must be a string");

      // logic
      if(!this._focus_log()) return;
      this.time_end = new Date();
      this._new_log(conclusion_log, conclusion_type);
      if(this.save){
         // validate
         if(this.logs.length === 0) throw new Error("Logs must have at least one log");
         if(this.logs.some(log => !(log instanceof Log))) throw new Error("Logs must be an array of Log instances");
         if(!this.time_start) throw new Error("Time start is required");
         if(!this.time_end) throw new Error("Time end is required");
         if(!this.path) throw new Error("Path is required");
         if(typeof this.path !== "string") throw new Error("Path must be a string");

         // logic
         const logs_block = this._build_logs_block();
         this._save_logs_block(logs_block);
      }
      this._clean();
      return this;
   }
   _clean(){
      this.logs = [];
      this.time_start = null;
      this.time_end = null;
      clearTimeout(this.timer);
   }
   _start_timer(){
      // validate
      if(!this.timeout) throw new Error("Timeout is required");
      if(typeof this.timeout !== "number") throw new Error("Timeout must be a number");
      if(this.timeout < 0) throw new Error("Timeout must be a positive number");

      // logic
      if(this.timer) clearTimeout(this.timer);
      this.time_start = this.time_start ? this.time_start : new Date(); // Si time_start existe, no se reinicia
      this.timer = setTimeout(() => {
         const conclusion_log = `${this.title} - Timeout watching logs ${this.timeout}ms`;
         const conclusion_type = "info";
         this._end_log(conclusion_log, conclusion_type);
      }, this.timeout);
   }
   _build_path(){
      // validate
      this._validate_constructor();

      // logic
      let normalized_title = this.title;
      normalized_title = normalized_title.trim();
      normalized_title = normalized_title.replace(/[^\w\s-]/g, ''); // Elimina caracteres especiales
      normalized_title = normalized_title.replace(/[\s\n\t]+/g, '_'); // Reemplaza espacios y saltos por _
      normalized_title = normalized_title.replace(/-+/g, '_'); // Reemplaza guiones por _
      normalized_title = normalized_title.replace(/_{2,}/g, '_'); // Elimina _ múltiples
      normalized_title = normalized_title.toLowerCase();
      normalized_title = normalized_title.replace(/^_+|_+$/g, ''); // Elimina _ al inicio y final
      this.path = `${this.base_path}/${normalized_title}.log`;

      return this.path;
   }
   _validate_constructor(){
      if(!this.title) throw new Error("Title is required");
      if(typeof this.title !== "string") throw new Error("Title must be a string");
      if(!this.base_path) throw new Error("Base path is required");
      if(typeof this.base_path !== "string") throw new Error("Base path must be a string");
      if(this.timeout === undefined || isNaN(this.timeout) || this.timeout === null) throw new Error("Timeout is required");
      if(typeof this.timeout !== "number") throw new Error("Timeout must be a number");
      if(this.timeout < 0) throw new Error("Timeout must be a positive number");

   }
	_new_log(messages, type) {
		//validate
		if (!messages) throw new Error("Messages is required");
		if (!(messages?.length > 0)) throw new Error("Messages is required");
		if (!type) throw new Error("Type is required");

      
		//logic
      if(!this._focus_log()) return;

      this._start_timer();

		if (!Array.isArray(messages)) messages = [messages];
		const log = new Log({
         mode: this.mode,
         colorize: this.colorize,
      });
		log.set_message(...messages)
			.set_type(type)
         .set_prefix(`${this.title} -`);
      if(this.save) log.set_filepath(this.path);
      log.run();

      this.logs.push(log);
      this._save_master_log(log);
		return log;
	}
   _focus_log(){
      let focus_logs = process.env.FOCUS_LOGS;
      if(!focus_logs) return true;
      focus_logs = focus_logs.split(",");
      if(focus_logs.length === 0) return true;
      if(focus_logs.includes("ALL")) return true;
      if(focus_logs.includes(this.title)) return true;
      return false;
   }
}

module.exports = LOGGER;
