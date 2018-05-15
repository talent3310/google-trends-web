'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('hiddenItems', {
      url: '/hiddenItems',
      template: '<hidden-items></hidden-items>'
    });
}
