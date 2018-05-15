'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.ip
    || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.PORT
    || 8080,

  sequelize: {
    uri: process.env.SEQUELIZE_URI
      || 'mysql://sysadmin:talentcode331@127.0.0.1/gtrends',
    options: {
      logging: false,
      storage: 'mysql',
      define: {
        timestamps: false
      }
    }
  }
};


