'use strict';
export function FeedsResource($resource) {
  'ngInject';

  return $resource('/api/feeds/:id/:controller/', {
    id: '@_id'
  }, {
    getFilteredData: {
      method: 'POST',
      params: {
        id: 'getFilteredData'
      }
    },
    move: {
      method: 'POST',
      params: {
        id: 'move'
      }
    }, 
    unhide: {
      method: 'POST',
      params: {
        id: 'unhide'
      }
    },
    removeFromMonitor: {
      method: 'POST',
      params: {
        id: 'removeFromMonitor'
      }
    },
    getHistory: {
      method: 'POST',
      params: {
        id: 'getHistory'
      }
    },
    setPriority: {
      method: 'POST',
      params: {
        id: 'setPriority'
      }
    }
  });
}
