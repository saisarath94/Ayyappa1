var log4js = require('log4js');
log4js.configure({
  appenders: [
    {
      type: 'console'
    },
    {
      type: 'file',
      filename: 'logs/loggerCronJobs.log',
      category: 'fankick',
      maxLogSize: 1024 * 1024 * 5, // 5MB size
      backups: 3
    }
  ]
});
var logger = log4js.getLogger('fankick');
logger.setLevel('DEBUG');
exports = module.exports = logger;