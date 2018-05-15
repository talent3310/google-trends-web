'use strict';
const angular = require('angular');
function filterChartData(arr, specNum) {//data.default.timelineData;
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
    chartDataArr.push({period: arrData[i].formattedTime, value: arrData[i].value[0]});
  }
  return chartDataArr;
}

export default angular.module('morrisCharts', [])

  .directive('ngMorrisLineChart', function() {
    return {
      restrict: 'EA',
      scope: {
        chartData: '=',
        chartOptions: '='
      },
      replace: true,
      template: '<div></div>',
      link: function link(scope, element) {
        // if (scope.chartData && scope.chartOptions) {
        //     scope.chartOptions.element = element;
        //     scope.chartOptions.data = scope.chartData;
        //     new Morris.Line(scope.chartOptions);
        //   }
 
        scope.$watch('chartData', function() {
          if (scope.chartData && scope.chartOptions) {
            scope.chartOptions.element = element;
            scope.chartOptions.data = scope.chartData;
            if (!scope.chartInstance) { scope.chartInstance = new Morris.Line(scope.chartOptions); } else { scope.chartInstance.setData(scope.chartData); }
          }
        });
        
      }
    };
  })

  .directive('ngMorrisAreaChart', function() {
    return {
      restrict: 'EA',
      scope: {
        chartData: '=',
        chartOptions: '='
      },
      replace: true,
      template: '<div></div>',
      link: function link(scope, element) {
        scope.$watch('chartData', function() {
          if (scope.chartData && scope.chartOptions) {
            scope.chartOptions.element = element;
            scope.chartOptions.data = scope.chartData;
            if (!scope.chartInstance) { scope.chartInstance = new Morris.Area(scope.chartOptions); } else { scope.chartInstance.setData(scope.chartData); }
          }
        });
      }
    };
  })

  // Bar option settings: https://morrisjs.github.io/morris.js/bars.html
  .directive('ngMorrisBarChart', function() {
    return {
      restrict: 'EA',
      scope: {
        chartData: '=',
        chartOptions: '='
      },
      replace: true,
      template: '<div></div>',
      link: function link(scope, element) {
        if (scope.chartData && scope.chartOptions) {
          scope.chartOptions.element = element;
          // scope.chartOptions.data = scope.chartData;
          var ss = JSON.parse(scope.chartData)
          var tt = filterChartData(ss.default.timelineData, 20);
          scope.chartOptions.data = tt;
          new Morris.Bar(scope.chartOptions);  
        }
      }
    };
  })

  // Donut option settings: https://morrisjs.github.io/morris.js/donuts.html
  .directive('ngMorrisDonutChart', function() {
    return {
      restrict: 'EA',
      scope: {
        chartData: '=',
        chartOptions: '='
      },
      replace: true,
      template: '<div></div>',
      link: function link(scope, element) {
        scope.$watch('chartData', function() {
          if (scope.chartData && scope.chartOptions) {
            scope.chartOptions.element = element;
            scope.chartOptions.data = scope.chartData;
            if (!scope.chartInstance) { scope.chartInstance = new Morris.Donut(scope.chartOptions); } else { scope.chartInstance.setData(scope.chartData); }
          }
        });
      }
    };
  })
  .name;
