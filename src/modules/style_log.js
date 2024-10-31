const chalk = require('chalk');

class STYLE_LOG {
    constructor(all_color = false) {
       this.pre_info = "info: ";
       this.pre_warn = "warn: ";
       this.pre_error = "error: ";
       this.pre_success = "success: ";
       this.pre_silly = "silly: ";
       this.pre_json = "json: ";
       this.all_color = all_color;
       this.text;
       this.prefix;
    }
    _chalk_result(prefix, color) {
       const prefix_style = `${chalk[color](this[prefix])}`;
       const text_Style = `${this.all_color ? chalk[color](this.text) : this.text}`;
       return `${prefix_style}${text_Style}`;
    }
 
    info(text, all_color) {
       this.text = text;
       this.all_color = all_color;
       const result = this._chalk_result("pre_info", "blue");
       return result;
    }
    warn(text, all_color) {
       this.text = text;
       this.all_color = all_color;
       const result = this._chalk_result("pre_warn", "yellow");
       return result;
    }
    error(text, all_color) {
       this.text = text;
       this.all_color = all_color;
       const result = this._chalk_result("pre_error", "red");
       return result;
    }
    success(text, all_color) {
       this.text = text;
       this.all_color = all_color;
       const result = this._chalk_result("pre_success", "green");
       return result;
    }
    silly(text, all_color) {
       this.text = text;
       this.all_color = all_color;
       const result = this._chalk_result("pre_silly", "magenta");
       return result;
    }
    json(text, all_color) {
       this.text = text;
       this.all_color = all_color;
       const result = this._chalk_result("pre_json", "magenta");
       return result;
    }
 }

 module.exports = STYLE_LOG;