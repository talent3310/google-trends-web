'use strict';

// Set default node environment to development
var env = process.env.NODE_ENV = (process.env.NODE_ENV || 'development');

if (env === 'development' || env === 'test') {
  // Register the Babel require hook
  require('babel-core/register');
}

var sequelizeInstance = require('.').sequelize;
var Umzug = require('umzug');
var umzug = new Umzug({
  // The storage.
  // Possible values: 'json', 'sequelize', an argument for `require()`, including absolute paths
  storage: 'sequelize',

  // The options for the storage.
  // Check the available storages for further details.
  storageOptions: {
    sequelize: sequelizeInstance
  },

  // The logging function.
  // A function that gets executed everytime migrations start and have ended.
  logging: console.log,

  migrations: {
    params: [sequelizeInstance.getQueryInterface(), sequelizeInstance.constructor],
    path: 'server/migrations'
  }
});

var donePromise;
if (process.argv[2] === 'down') { 
  donePromise = umzug.down().then(function (migrations) {
    console.log("DOWN-ed migrations:");
    migrations.forEach((mig) => {console.log(mig.file);});
  });
} else if (process.argv[2] === 'markDone') {
  donePromise = umzug.pending()
  .then((migrations) => {
    console.log("MARKED-DONE migrations:");
    return Promise.all(migrations.map((mig) => {
      return umzug.storage.logMigration(mig.file)
      .then(() => {console.log('OK  : '+mig.file);})
      .catch((err) => {console.error('FAIL: '+mig.file);})
    }))
  })
} else {
  donePromise = umzug.up().then(function (migrations) {
    console.log("UP-ed migrations:");
    migrations.forEach((mig) => {console.log(mig.file);});
  });
}

donePromise
  .then(() => { process.exit();})
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });