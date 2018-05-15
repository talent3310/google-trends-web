'use strict';
const angular = require('angular');

export default angular.module('directives', [])
  .directive('rowSelect', function() {
    return {
      require: '^stTable',
      template: '<input type="checkbox">',
      scope: {
        row: '=rowSelect'
      },
      link: function(scope, element, attr, ctrl) {
        element.bind('click', function(evt) {
          scope.$apply(function() {
            ctrl.select(scope.row, 'multiple');
          });                                                                       
        });
        scope.$watch('row.isSelected', function(newValue) {
          if (newValue === true) {
            // element.parent().addClass('st-selected');
            element.find('input').prop('checked', true);
          } else { 
            // element.parent().removeClass('st-selected');
            element.find('input').prop('checked', false);
          }
        });
      }
    };
  })
  .directive('rowSelectAll', function() {
    return {
      require: '^stTable',
      template: '<input type="checkbox">',
      scope: {
        all: '=rowSelectAll',
        selected: '='
      },
      link: function(scope, element, attr) {
        scope.isAllSelected = true;
        element.bind('click', function(evt) {
          scope.$apply(function() {
            scope.all.forEach(function(val) {
              val.isSelected = scope.isAllSelected;
            });
          });
        });
        scope.$watchCollection('selected', function(newVal) {
          if (scope.all) {
            var s = newVal.length;
            var a = scope.all.length;
            if ((s == a) && s > 0 && a > 0) {
              element.find('input').prop('checked', true);
              scope.isAllSelected = false;
            } else {
              element.find('input').prop('checked', false);
              scope.isAllSelected = true;
            }
          }
        });
      }
    };
  })
  .directive('keywordLink', function() {
    return {
      restrict: 'EA',
      template: '<a ng-href="{{link}}" target="_blank">{{keyword}}</a>',
      scope: {
        row: '='
      },
      link: function(scope, element, attr) {
        scope.$watch('row', function() {
          scope.keyword = scope.row.keyword;
          var link_1 = 'https://www.google.com/search?q=';
          var link_2 =  encodeURIComponent(scope.row.keyword);
          scope.link = link_1 + link_2;
          
        });
      }
    };
  })
  .directive('kewwordLinkGoogle', function() {
    return {
      restrict: 'EA',
      template: '<a ng-href="{{link}}" target="_blank" class="i-link"><i class="fa fa-google-plus" aria-hidden="true"></i></a>',
      scope: {
        row: '='
      },
      link: function(scope, element, attr) {
        scope.$watch('row', function() {
          var link_1 = 'https://trends.google.com/trends/explore?';
          var link_cat, link_date, link_cat, link_q, link_gprop;

          //category
          if (scope.row.path != '0') {
            var partsOfStr = scope.row.path.split(',');
            link_cat = 'cat=' + partsOfStr[partsOfStr.length - 1];
          } else {
            link_cat = '';
          }
          //date
          link_date = '&date=today%205-y&geo=US';
          if (scope.row.searchType === 'web') {
            link_gprop = '';
          } else {
            link_gprop = '&gprop=' + scope.row.searchType;
          }

          link_q = '&q=' + encodeURIComponent(scope.row.keyword);

          scope.link = link_1 + link_cat + link_date + link_gprop + link_q;
          
        });
      }
    };
  })
  .directive('stPaginationScroll', ['$timeout', function(timeout) {
    return {
      require: '^stTable',
      link: function(scope, element, attr, ctrl) {
        var itemByPage = 50;
        var pagination = ctrl.tableState().pagination;
        var lengthThreshold = 50;
        var timeThreshold = 400;
        var handler = function() {
          //call next page
          ctrl.slice(pagination.start + itemByPage, itemByPage);
        };
        var promise = null;
        var lastRemaining = 9999;
        var container = angular.element('.main-wrapper');

        container.bind('scroll', function() {
          var remaining = container[0].scrollHeight - (container[0].clientHeight + container[0].scrollTop);

          //if we have reached the threshold and we scroll down
          if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

            //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
            if (promise !== null) {
              timeout.cancel(promise);
            }
            promise = timeout(function() {
              handler();

              //scroll a bit up
              container[0].scrollTop -= 0;

              promise = null;
            }, timeThreshold);
          }
          lastRemaining = remaining;
        });
      }

    };
  }])
  .directive('pageSelect', function() {
      return {
        restrict: 'E',
        template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
          scope.$watch('currentPage', function(c) {
            scope.inputPage = c;
          });
        }
      }
    })
  // .directive('graphRanking', function() {
  //   return {
  //     template: '<div>{{rankingValue}}</div>',
  //     scope: {
  //       data: '='
  //     },
  //     link: function(scope, element, attr, ctrl) {
  //       var graphData = JSON.parse(scope.data.graphInfo).default.timelineData;
  //       var t1 = 1/5, A = 1, B = 6 / 100;
  //       var averageTotal, averageT1; 
  //       var sumTotal = 0, sumT1 = 0;
  //       // console.log("graphData===========>", graphData);
  //       for(var i = 0; i < graphData.length; i++) {
  //         sumTotal += graphData[i].value[0];
  //         if(i > graphData.length*(1 - t1)) {
  //           sumT1 += graphData[i].value[0];
  //         }
  //       }
  //       averageTotal = sumTotal / graphData.length;
  //       averageT1 = sumT1 / (graphData.length * t1);
  //       scope.rankingValue = A * averageT1 / averageTotal + B * averageTotal;

  //     }
  //   };
  // })
  .name;
