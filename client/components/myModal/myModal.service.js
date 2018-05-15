'use strict';

const angular = require('angular');

export function myModal($rootScope, $uibModal) {
  var factory = {};
  factory.open = function(row) {
    var modalInstance = $uibModal.open({
      animation: true,
      component: 'myModalComponent',
      resolve: {
        row: function() {
          // return $ctrl.items;
          return row;
        }
      }
    });

    modalInstance.result.then(function() {

    }, function() {
      // $log.info('modal-component dismissed at: ' + new Date());
    });

  }

  // Public API here
  return factory;
}
var xAxisArr = [];
var tooltipArr = [];
function filterChartData(arr, specNum) { //data.default.timelineData;
  var arrData = arr
  var chartDataArr = [];
  for (var i = 0; i < arrData.length; i++) {
    chartDataArr.push({ x: i, y: arrData[i].value[0] });
    xAxisArr.push(arrData[i].formattedAxisTime);
    tooltipArr.push(arrData[i].formattedTime);
  }
  return chartDataArr;
}

export function modalController() {
  this.$onInit = function() {
    var dataArr = JSON.parse(this.resolve.row.graphInfo).default.timelineData;
    this.nvd3 = {
      options: {
        chart: {
          type: 'lineChart',
          height: 250,
          margin: {
            top: 20,
            right: 20,
            bottom: 40,
            left: 55
          },
          x: function(d) { return d.x; },
          y: function(d) { return d.y; },
          useInteractiveGuideline: false,
          // dispatch: {
          //   stateChange: function(e) { console.log("stateChange"); },
          //   changeState: function(e) { console.log("changeState"); },
          //   tooltipShow: function(e) { console.log("tooltipShow"); },
          //   tooltipHide: function(e) { console.log("tooltipHide"); }
          // },
          xAxis: {
            // axisLabel: 'Date',
            tickFormat: function(d) {
              return xAxisArr[d];
            },
          },
          yAxis: {
            // axisLabel: 'Value',
            // tickFormat: function(d) {
            //   return d3.format('.02f')(d);
            // },
            axisLabelDistance: -10
          },
          tooltip: {
            contentGenerator: function(e) { 
              var series = e.series[0];
              if (series.value === null) return;
              return '<div  style="padding: 8px; text-align: center">' + tooltipArr[e.value] + '<div style="height: 6px"></div>' + 
              '<b>' + (series.value?series.value:0) + '</b></div>';
            }
          },
          callback: function(chart) {
            console.log("!!! lineChart callback !!!");
          }
        },
      },
      data: [{
        values: filterChartData(dataArr), //values - represents the array of {x,y} data points
        key: this.resolve.row.keyword, //key  - the name of the series.
        color: '#007bff', //color - optional: choose your own line color.
        strokeWidth: 2,
        classed: 'dashed'
      }]
    }

    
  };

  this.ok = function() {
    this.close({ $value: 'test' });
  };

  this.cancel = function() {
    this.dismiss({ $value: 'cancel' });
  };
}

export default angular.module('webApp.myModal', [])
  .factory('myModal', myModal)
  .component('myModalComponent', {
    template: require('./myModal.html'),
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: modalController
  })
  .name;
