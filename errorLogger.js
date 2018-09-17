var log4js = require('log4js');
log4js.configure({
  appenders: [
    { 
      type: 'console'
    },
    {
      type: 'file',
      filename: 'logs/errorLogger.log',
      category: 'errorLogger',
      maxLogSize: 1024 * 1024 * 5, // 10MB size
      backups: 3
    }
  ]
});
var errorLogger = log4js.getLogger('errorLogger');
errorLogger.setLevel('DEBUG');
exports = module.exports = errorLogger;