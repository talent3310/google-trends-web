'use strict';

var express = require('express');
var controller = require('./feed.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/getFilteredData', controller.getFilteredData);
router.post('/move', controller.moveFromFeeds);
router.post('/unhide', controller.unhideFromHides);
router.post('/removeFromMonitor', controller.removeFromMonitor);
router.post('/getHistory', controller.getHistory);
router.post('/setPriority', controller.setPriority);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
