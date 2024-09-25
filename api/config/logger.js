import winston from 'winston';
import moment from 'moment';

let options = {
  file: {
      level: 'debug',
      filename: `logs/EXPRESS_TEMPLATE_ES6_${moment().format('YYYY-MM-DD')}.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // max 5MB
      maxFiles: 5,
      colorize: true,
  },
  console: {
      json: true,
      colorize: true,
      level: 'info',
      handleExceptions: true
      
  }
};

const logger = winston.createLogger({
  format: winston.format.combine(
		winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.printf(info => `${info.timestamp} | ${info.level.toUpperCase()} | ${info.message}`),
    winston.format.colorize(),
		// winston.format.json()
	),
  transports: [
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/activity.log', level: 'info' }),
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
});

// logger.add(new winston.transports.Console({
// 	format: winston.format.simple()
// }));

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger