'use strict';

import angular from 'angular';
import { FeedsResource } from './feeds.service';
import { LazyCall } from './lazyCall.service';

export default angular.module('webApp.models', [])
  .factory('FeedsResource', FeedsResource)
  .factory('LazyCall', LazyCall)
  .name;
