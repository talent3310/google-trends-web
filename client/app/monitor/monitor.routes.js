'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('monitor', {
      url: '/monitor',
      template: '<monitor></monitor>'
    });
}
