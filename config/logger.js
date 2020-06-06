var appRoot = require('app-root-path');
var winston = require('winston');

var options = {
  file: {
      level: 'info',
      filename: `${appRoot}/logs/playground-deployer.log`,
      handleExceptions: true,
      json: true,
      maxsize: '500k',
      colorize: false,
  },
  console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true,
  },
};

var logger = winston.createLogger({
  transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
  ],
  exitOnError: false,
});

logger.stream = {
  write: function(message, encoding) {
      logger.info(message);
  },
};

module.exports = logger;