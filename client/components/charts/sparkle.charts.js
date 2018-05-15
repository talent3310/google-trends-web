'use strict';
const angular = require('angular');
function filterChartDataOnlyValue(arr, specNum) {//data.default.timelineData;
  var arrData = arr
  var specNum = specNum ? specNum : 20;
  var chartDataArr = [];
  // var count = 0; var tempValue = 0; var tempStartDate ; var tempEndDate;

  // for(var i = 0; i < arrData.length; i++) {
  //   count++;
  //   if(count == 1) {
  //     tempStartDate = arrData[i].formattedTime.split(" - ")[0];
  //   }
  //   tempValue += arrData[i].value[0];
    
  //   if(count > specNum || i == arrData.length - 1) {
  //     tempEndDate = arrData[i].formattedTime.split(" - ")[1];
  //     chartDataArr.push(Math.round(tempValue/count));
  //     count = 0;
  //     tempValue = 0;
  //   }
  // }

  for(var i = 0; i < arrData.length; i++) {
    chartDataArr.push(arrData[i].value[0]);
  }
  return chartDataArr;
}
export default angular.module('SparkleCharts', [])
  .directive('ngSparkleBarChart', function() {
    return {
      restrict: 'EA',
      scope: {
        chartData: '=',
      },
      replace: true,
      template: '<div></div>',

      link: function link(scope, element, attrs) {
          // console.log("element=====>", element);
      	scope.$watch('chartData', function(){
          var render = function () {
            var ss = JSON.parse(scope.chartData);
            var values = filterChartDataOnlyValue(ss.default.timelineData, 1);
            var width = 320;
            if($( window ).width() < 512) width = 250;
            if($( window ).width() < 446) width = 220;
            if($( window ).width() < 416) width = 200;
            if($( window ).width() < 376) width = 180;
            $(element).sparkline(values, {type: 'line', barColor: 'green', width: width, height: 40} );
          }
          setTimeout(function(){ render(); }, 0);
        });
      }
    };
  })
  .directive('ngSparklePieChart', function() {
    return {
      restrict: 'EA',
      scope: {
        chartData: '=',
      },
      replace: true,
      template: '<div></div>',

      link: function link(scope, element, attrs) {
        scope.$watch('chartData', function(){
          var render = function () {
            var ss = [ scope.chartData, 24 - scope.chartData];
            $(element).sparkline(ss, {type: 'pie', width: 30, height: 30, offset: -90, borderWidth: 0} );
          }
          setTimeout(function(){ render(); }, 0);
        });
      }
    };
  }).name;