/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';
import option from '../option'
var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below

db.diff_past1day_view = db.sequelize.import('../api/feed/diff_past1day_view.model');
db.diff_past7days_view = db.sequelize.import('../api/feed/diff_past7days_view.model');
db.diff_past30days_view = db.sequelize.import('../api/feed/diff_past30days_view.model');

db.FilteredFeeds = db.sequelize.import('../api/feed/filtered_feeds_view.model');
db.Monitor = db.sequelize.import('../api/feed/monitor.model');
db.Hides = db.sequelize.import('../api/feed/hides.model');
db.Feed = db.sequelize.import('../api/feed/feed.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = db.sequelize.import('../api/user/user.model');

module.exports = db;
