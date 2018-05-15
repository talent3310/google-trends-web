'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('webApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
