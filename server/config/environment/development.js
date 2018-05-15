'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    uri: 'mysql://root:@127.0.0.1/gtrends',
    // uri: 'mysql://remoteUser:talentcode331@88.80.184.15/gtrends',
    options: {
      logging: false,
      storage: 'mysql',
      define: {
        timestamps: false
      }
    }
  },

  // Seed database on startup
  seedDB: true

};

