/**
 * Feed model events
 */

'use strict';

import {EventEmitter} from 'events';
var Feed = require('../../sqldb').Feed;
var FeedEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FeedEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Feed) {
  for(var e in events) {
    let event = events[e];
    Feed.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    FeedEvents.emit(event + ':' + doc._id, doc);
    FeedEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(Feed);
export default FeedEvents;
