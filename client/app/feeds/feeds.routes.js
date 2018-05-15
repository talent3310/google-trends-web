'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('feeds', {
      url: '/',
      template: '<feeds></feeds>'
    });
}
