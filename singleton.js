class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    this.logs = [];
    Logger.instance = this;
  }

  log(message) {
    this.logs.push(message);
  }

  printLogs() {
    console.log(this.logs);
  }
}

const logger1 = new Logger();
logger1.log("First log message");

const logger2 = new Logger();
logger2.log("Second log message");

logger1.printLogs();
logger2.printLogs();

console.log(logger1 === logger2);
