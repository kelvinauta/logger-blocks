const chalk = require('chalk');
const uuid = require('uuid');
const fs = require('fs-extra');

const STYLE_LOG = require('./style_log');

class Log { // individual log
    constructor(message, type = "info", prefix ="", filepath) {
        // params
        this.message = message;
        this.type = type;
        this.prefix = prefix;
        this.filepath = filepath;
        this.style_log = new STYLE_LOG();

        // defaults config
        this.separator = " | ";

        // clusters
        this.log_data = null;
    }
  
    run(){
       // validate
       this._validate_params();

       // logic
       this.log_data = this._build_log();
       this._print();
       if(this.filepath) this._append();
       
       return this.log_data;
    }

    // setters
    set_message(...messages){
        this.message = this._build_message(...messages);
        return this;
    }
    set_type(type){
        this.type = type;
        return this;
    }
    set_prefix(prefix){
        this.prefix = prefix;
        return this;
    }
    set_filepath(filepath){
        this.filepath = filepath;
        return this;
    }

    // getters
    get_log_data(){
        return this.log_data;
    }
    get_log(){
       return this.log_data.simple_out_log;
    }
    get_style_log(){
       return this.log_data.out_log;
    }

    _build_message(...messages) {
        // Tratamiento del input de los mensajes
        if (!(messages?.length > 0)) throw new Error("Messages is required");
        let result = "";
        messages.forEach((msg, i) => {
           if(!msg) return;
  
           const is_last = i < messages.length - 1;
           result += `${this._format_message(msg)}${is_last ? " " : ""}`; // Añade un espacio si no es el último mensaje
        });
        return result;
     }
     _format_message(message) {
        // validate
        if (!message) throw new Error("Message is required"); // Si no hay mensaje no hace nada

        // logic
        if(typeof message !== "object") return message;

        let result = "";
        result += `\n`;
        result += JSON.stringify(message, null, 2);
        result += `\n`; 
        return result;
     }
    _build_log() {
        // Validate
        if(!this.message) throw new Error("Message is required");
        if(!this.type) throw new Error("Type is required");

        // Logic
        if(this.prefix) this.message = `${this.prefix}${this.message}`;
        const now = new Date();
        const style_log = this.style_log[this.type](this.message)
        const simple_log = `${this.type}: ${this.message}`;
        const now_iso = now.toISOString();
        const out_log = `${style_log}${this.separator}${now_iso}`; // With Style
        const simple_out_log = `${simple_log}${this.separator}${now_iso}`; // Simple
        const log_data = {
           id: this.id,
           type: this.type,
           message: this.message,
           time: now,
           out_log,
           style_log,
           simple_log,
           simple_out_log
        }
        this.log_data = log_data;
        return log_data;
     }
     _print() {
        // validate
        this._validate_log_data(this.log_data);
        // logic
        this.log_data = {
            ...this.log_data,
            print: true
        };
        console.log(this.log_data.out_log);
        return this.log_data;
     }
     _append() {
        // Validate
        this._validate_log_data(this.log_data);
        if(!this.filepath) throw new Error("Filepath is required");
        // Logic
        this.log_data = {
            ...this.log_data,
            append: true
        };
        fs.ensureFileSync(this.filepath);
        fs.appendFileSync(this.filepath, `${this.log_data.simple_out_log}\n`);
        return this.log_data;
     }

     _validate_log_data(log_data) {
        // Valida el log data
        if(!log_data) throw new Error("Log data is required");
        if(!log_data.out_log) throw new Error("Log data is required");
        if(!log_data.simple_out_log) throw new Error("Log data is required");
        if(!log_data.style_log) throw new Error("Log data is required");
        if(!log_data.simple_log) throw new Error("Log data is required");
        if(!log_data.type) throw new Error("Log data is required");
        if(!log_data.message) throw new Error("Log data is required");
        if(!log_data.time) throw new Error("Log data is required");
     }
     _validate_params(){
        if(!this.message) throw new Error("Message is required");
        if(!this.type) throw new Error("Type is required");
        if(typeof this.type !== "string") throw new Error("Type must be a string");
        if(typeof this.prefix !== "string") throw new Error("Prefix must be a string");
        
     }
}

module.exports = Log;