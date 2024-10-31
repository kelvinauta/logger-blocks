// TODO: Convertir este código en una librería que se pueda reutilizar en otros proyectos
const chalk = require('chalk');
const uuid = require('uuid');
const fs = require('fs-extra');
const Log = require('./log.js');

class LOGGER {
   constructor({
      id = uuid.v4(),
      title,
      description,
      prompt,
      save = true,
      path = "./logs", // Ruta por defecto
      prefix,
      timeout = 15000, // Tiempo por defecto para guardar un bloque de logs
      time_start = new Date(),
      time = true, separator = " | ",
      separator_vertical = `------------------\n`,
      print_end = true,
      emojis = true,
      save_json = false
   }) {
      this.id = id; // ID del logger
      this.title = title; // Nombre del logger
      this.description = description; // Para qué se usará el logger
      this.conclusion_log; // Log de conclusión del hilo de logs
      this.conclusion_type; // Tipo de log de conclusión del hilo de logs (info, warn, error, success, silly)
      this.prompt = prompt; // Prompt por defecto del logger para análisis de IA
      this.save = save; // Guardar o no guardar el log
      this.path = path; // Ruta donde se guardará el log
      this.prefix = prefix; // Prefijo de los archivos de log
      this.logs = []; // Logs en memoria
      this.type; // Tipo de log (info, warn, error, success, silly)
      this.timeout = timeout; // Tiempo de espera para guardar un bloque de logs
      this.set_timeout;
      this.time_start = time_start; // Tiempo de inicio del bloque de logs
      this.time_end; // Tiempo de fin del hilo de los logs
      this.style_log = new STYLE_LOG({}); // Estilo de los logs
      this.time = time; // Mostrar o no el tiempo en cada log
      this.separator = separator; // Separador de logs
      this.separator_vertical = separator_vertical; // Separador de bloques de logs
      this.print_end = print_end; // Imprimir el bloque de logs al finalizar
      this.auto_save = (this.save && (this.timeout === 0)) ? true : false; // Guardar automáticamente cada log sin Bloques
      this.emojis = emojis; // Mostrar o no emojis en los logs
      this.save_json = save_json; // Guardar los logs en formato json
   }

   // Setters
   Title(title) {
      this.title = title;
      return this;
   }
   Description(description) {
      this.description = description;
      return this;
   }
   Prompt(prompt) {
      this.prompt = prompt;
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
   Prefix(prefix) {
      this.prefix = prefix;
      return this;
   }

   // Private Functions
   _contruct_log(message, type = "info") {
      // Construye un log
      if(this.prefix) message = `${this.prefix}${message}`;
      const now = new Date();
      const style_log = this.style_log[type](message)
      const simple_log = `${type}: ${message}`;
      const now_iso = now.toISOString();
      const out_log = `${style_log}${this.separator}${this.time ? `${now_iso}` : ""}`;
      const simple_out_log = `${simple_log}${this.separator}${this.time ? `${now_iso}` : ""}`;
      const log_data = {
         id: this.id,
         type: type,
         message: message,
         time: now,
         out_log,
         style_log,
         simple_log,
         simple_out_log
      }
      return log_data;
   }
   _log(message, type, time = true) {
      // Guarda el log y lo imprime en consola
      if (!message) return; // ? Debería lanzar un error si no hay mensaje? // Por ahora no
      this.time_start = new Date(); // Inicia el tiempo
      const log_data = this._contruct_log(message, type);
      this._save(log_data);
      console.log(log_data.out_log);

      if(!time || this.auto_save) return; 
      this._clear_timeout();
      this._set_timeout();
   }
   _get_log_block() {
      // Devuelve un bloque de logs
      if (this.logs.length === 0) {
         throw new Error("No logs to get");
      }
      const time = (this.time_end - this.time_start);

      const log_block = {
         id: this.id,
         title: this.title,
         logs: this.logs,
         time_start: this.time_start,
         time_end: this.time_end,
         time: time,
         conclusion_log: this.conclusion_log,
         conclusion_type: this.conclusion_type,
      }
      return log_block;
   }
   _get_path(filename, format) {
      const file = `${filename}.${format}`;
      return `${this.path}/${file}`;
   }
   _get_filename() {
      const filename = `${this.prefix ? `${this.prefix}_` : ""}${this.title}`;
      return filename;
   }

   _format_block(format = "log") {
      // Formatea un bloque de logs en el formato deseado (log, json, html, csv, etc)
      // TODO: Implementar otros formatos
      if (this.logs.length === 0) {
         throw new Error("No logs to format");
      }
      let result = "";
      const log_block = this._get_log_block();
      const seconds = log_block.time / 1000;
      if (format === "log") {
         result += `${log_block.title}${this.separator}seconds: ${seconds}\n`;
         if (log_block.conclusion_log) {
            // Imprime el log de conclusión
            const { style_log } = this._contruct_log(log_block.conclusion_log, log_block.conclusion_type);
            result += `${style_log}\n`;
         }
         result += `\n` // Salto de línea
         this.logs.forEach(log => {
            result += `${log.simple_out_log}\n`;
         });
         if (!this.auto_save) result += `${this.separator_vertical}`; // No hay necesidad de separador si es auto_save porque no hay bloques
      }
      if (format === "json") {
         result = JSON.stringify(log_block, null, 2);
      }
      return result;
   }
   _save(log_data, format = "log") {
      // Guarda un log en memoria y si auto_save es true lo guarda en disco
      this.logs.push(log_data); // Añade el log a la memoria
      if (!this.auto_save) return; // Si no es auto_save no guarda en disco
      const filename = this._get_filename();
      const path = this._get_path(filename, format);
      const data = this._format_block(format);
      this._save_file(path, data);
   }
   _save_log_block(format = "log") {
      // Guarda el bloque de logs
      // const log_block = this._get_log_block(); // ? Quizá el log_block no sea necesario en la clase
      if(!this.save) return; // No guarda si no está habilitado
      if(this.auto_save) return; // Si es autosave no existe el bloque
      const filename = this._get_filename()
      const path = this._get_path(filename, format);
      const data = this._format_block(format);
      this._save_file(path, data);
   }
   _save_file(path, data, add = true) {
      // Guarda un archivo en disco
      path = path.replace(/:/g, '.');
      // Comprueba si el o los folders existen y si no los crea
      const folder = path.split("/").slice(0, -1).join("/");
      const folder_exist = fs.existsSync(folder);
      const file_exist = fs.existsSync(path);
      function save(add, file_exist){
         if(add && file_exist) fs.promises.appendFile(path, data)
         else
         fs.promises.writeFile(path, data);
      }
      if (!folder_exist) {
         fs.promises.mkdir(folder, { recursive: true }).then(()=>{
            save(add, file_exist)
         })
      }else{
         save(add, file_exist)
      }
      return path;
   }
   _save_json_file(json) {
      // Guarda un archivo en formato json
      if (!this.save_json) return; // No guarda si no está habilitado
      const filename = `temp/${uuid.v4()}`;
      const path = this._get_path(filename, "json");
      const json_data = JSON.stringify(json, null, 2);
      return this._save_file(path, json_data, false);
   }
   _end_block(conclusion_log, conclusion_type = "info") {

      this._clear_timeout();
 
      if (this.logs.length === 0) return; // Si no hay logs no hace nada
      this.time_end = new Date();
      if (conclusion_log) {
         this.conclusion_log = conclusion_log;
         this.conclusion_type = conclusion_type;
         this._log(conclusion_log, conclusion_type);
      }
      if (this.print_end) {
         console.log(this._format_block());
      }
      if (this.save) {
         this._save_log_block();
      }
      
      this.time_start = new Date(); // Reinicia el tiempo
   }
   _clear_timeout() {
      clearTimeout(this.set_timeout);
   }
   _set_timeout() {
      if(this.auto_save) return; // No hay necesidad de timeout si es auto_save
      if (this.timeout !== 0) this.set_timeout = setTimeout(() => this._end_block(), this.timeout);
   }
   _format_input_message(message) {
      // Formatea el input de los mensajes
      if (!message) return; // Si no hay mensaje no hace nada
      let result = "";
      if (typeof message === "object") {
         result += `\n`; // Salto de línea
         result += JSON.stringify(message, null, 2);
         result += `\n`; // Salto de línea
         result += this._save_json_file(message)||""; 
      } else {
         result = message;
      }
      return result;
   }

   _input_message(...message) {
      // Tratamiento del input de los mensajes
      if (!(message?.length > 0)) return; // Si no hay mensaje no hace nada
      let result = "";
      message.forEach((msg, i) => {
         if(msg)
         result += `${this._format_input_message(msg)}${i < message.length - 1 ? " " : ""}`; // Añade un espacio si no es el último mensaje
      });
      return result;
   }
   // Functions
   log(...message) {
      message = this._input_message(...message)
      this._log(message, "info");
      return this;
   }
   info(...message) {
      message = this._input_message(...message)
      this._log(message, "info");
      return this;
   }
   warn(...message) {
      message = this._input_message(...message)
      this._log(message, "warn");
      return this;
   }
   error(...message) {
      message = this._input_message(...message)
      this._log(message, "error");
      return this;
   }
   success(...message) {
      message = this._input_message(...message)
      this._log(message, "success");
      return this;
   }
   silly(...message) {
      message = this._input_message(...message)
      this._log(message, "silly");
      return this;
   }
   json(...message) {
      message = this._input_message(...message)// Cambia el separador por defecto
      this._log(message, "json");
      return this;
   }
   end(conclusion_log, conclusion_type) {
      this._end_block(conclusion_log, conclusion_type);
      return this;
   }
}


module.exports = LOGGER;