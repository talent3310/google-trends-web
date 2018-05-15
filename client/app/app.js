'use strict';

// import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-validation-match';

import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import filterHeader from '../components/header/header.directive';
import morrisCharts from '../components/charts/morris.charts';
import SparkleCharts from '../components/charts/sparkle.charts';

import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';

import FeedsComponent from './feeds/feeds.component';
import MonitorComponent from './monitor/monitor.component';
import HiddenItemsComponent from './hiddenItems/hiddenItems.component';

import 'angular-smart-table';
import models from '../components/models/index';
import dwLoading from '../components/loading/loading';
import filters from '../components/filter';
import directives from '../components/directives/directives.js';
import Modal from '../components/modal/modal.service.js';
import myModal from '../components/myModal/myModal.service.js';
import './app.scss';

angular.module('webApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, _Auth, account, 'smart-table',
    admin, 'validation.match', navbar, footer, main, constants, util, FeedsComponent, MonitorComponent, HiddenItemsComponent, filterHeader,
    models, dwLoading, morrisCharts, SparkleCharts, filters, directives, Modal, myModal, 'nvd3'
  ])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth, $state, FeedsResource) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    function getYMD(date) {
      var dateObj = date;
      var month = dateObj.getMonth() + 1; //months from 1-12
      var day = dateObj.getDate();
      var year = dateObj.getFullYear();
      var newdate = year + "-" + month + "-" + day;
      return newdate;
    }

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if (!loggedIn) {
          setTimeout(function() {
            event.preventDefault();
            $state.go('login');
          }, 0);
        } else {
          FeedsResource.getHistory({ now: getYMD(new Date()) }, function(result) {
            $rootScope.history = {};
            $rootScope.history.one = result.one;
            $rootScope.history.seven = result.seven;
            $rootScope.history.thirty = result.thirty;
          });
        }
      });

      if (next.redirectTo) {
        event.preventDefault();
        $state.go(next.redirectTo, { location: 'replace' });
      }
    });

    var lastY;
    setTimeout(function() {
      $(function() {
        var box = $(".main-wrapper");   
        var scrollTime = 1.2; //Scroll time
        var scrollDistance = 170; //Distance. Use smaller value for shorter scroll and greater value for longer scroll
        box.on("touchstart", function(event) {
          lastY = event.touches[0].pageY;
        });
        box.on("touchmove", function(event) {
          var currentY = event.touches[0].pageY;
          event.preventDefault();
          var delta = (currentY - lastY ) / 8 || -event.originalEvent.detail / 3;
          var scrollTop = box.scrollTop();
          var finalScroll = scrollTop - parseInt(delta * scrollDistance);
          lastY = currentY;
          TweenMax.to(box, scrollTime, {
            scrollTo: { y: finalScroll, autoKill: true },
            ease: Power1.easeOut, //For more easing functions see https://api.greensock.com/js/com/greensock/easing/package-detail.html
            autoKill: true,
            overwrite: 5
          });
        });

        var scrollTop = $(".scrollTop");
        box.scroll(function() {
          var topPos = $(this).scrollTop();
          if (topPos > 100) {
            $(scrollTop).css("display", "block");
          } else {
            $(scrollTop).css("display", "none");
          }
          if (topPos > 120) {            
            $(scrollTop).css("opacity", "1");
          } else {
            $(scrollTop).css("opacity", "0");            
          }
        });
        //Click event to scroll to top
        $(scrollTop).click(function() {
          box.animate({
            scrollTop: 0
          }, 800);
          return false;
        });
      });
    }, 0);

  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['webApp'], {
      strictDi: true
    });
  });
