# Logger Block System

A powerful logging system designed to track and organize logs in blocks, perfect for following the complete flow of specific operations like API requests.

## Installation

```bash
npm install tuki_logger
```

## Usage

### Basic Usage

```javascript
const LOGGER = require('tuki_logger');

const logger = new LOGGER({
    title: "API Request",
    timeout: 5000
});

logger
    .info("Starting request to /api/users")
    .warn("Cache miss - fetching from database")
    .success("Data retrieved successfully")
    .end("Request completed", "success");
```

### JSON Logging

```javascript
const userData = {
    user: "john_doe",
    action: "login",
    timestamp: new Date()
};

logger
    .info("Processing user login")
    .json(userData)
    .success("Login successful")
    .end("Authentication completed", "success");
```

### Focused Logs

```bash
export FOCUS_LOGS=MAIN,TEST
```
This will only log logs with the title "MAIN" or "TEST".
If `FOCUS_LOGS` is not set or is `ALL`, all logs will be logged.

### Auto-closing Blocks

```javascript
const logger = new LOGGER({
    title: "Background Task",
    timeout: 3000  // Block will auto-close after 3 seconds
});

logger
    .info("Starting background process")
    .warn("Processing large dataset")
    .silly("Still working...");
    // No need to call .end() - will auto-close after timeout
```

### Save logs to file

Logs are stored in three different types of files:

1. `all_logs.log`: A centralized file that stores all individual system logs, without grouping them into blocks. This provides a complete chronological view of all logging activity.

2. `log_{title}.log`: Individual files for each Logger instance containing simple logs (without blocks) specific to that instance. The {title} is replaced with the configured title for the Logger.

3. `log_{title}_blocks.log`: Files that store logs grouped into blocks for each Logger instance. These blocks include additional metadata such as start/end times and total duration.

This structure allows both a unified view of all system logs and instance-specific views, making it easier to debug and monitor individual components.

```javascript
const logger = new LOGGER({
    title: "API Request",

    // false to no save logs; default: true
    save: true,

    // folder path to save logs; default: "./.logs"
    base_path: "./logs",

    // path to save all logs; default: "./.logs/all_logs.log"
    all_logs_path: "./logs/all_logs.log", 
});
```

## Features

- **Block-based Logging**: Groups related logs together for better traceability
- **Multiple Log Levels**: info, warn, error, success, silly, json
- **Auto-closing Blocks**: Automatically closes log blocks after a specified timeout
- **JSON Support**: Pretty prints JSON objects in logs
- **Chainable API**: Fluent interface for consecutive logging
- **File Storage**: Automatically saves logs to files (configurable)
- **Colored Output**: Console output with color-coded log levels
- **Save to file**: Logs are saved to file (configurable)


## Use Cases

Perfect for:
- API request tracking
- Transaction monitoring
- Process flow logging
- Debug sessions
- Background task monitoring

