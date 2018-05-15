'use strict';
const angular = require('angular');
var categories = require('./categories');


export default angular.module('filterHeader', [])
  .directive('filterHeader', function() {
    return {
      template: require('./header.directive.html'),
      restrict: 'EA',
      scope: {
        type: '=',
        call: '&',
      },
      link: function(scope, element, attrs, ctrl) {
        $('#sidebar-collapse-btn').on('click', function(event){
          event.preventDefault();
          
          $("#app").toggleClass("sidebar-open");
        });
      },
      controller: function($scope, $rootScope) {
        //initialize
        $scope.categories = categories.data.children;
        // $scope.history = $rootScope.history;
        var nonStr = 'Self'; 
        $scope.nStr = nonStr;
        $scope.today = new Date();
        $scope.date = new Date();
        
        $scope.searchTypes = [
          { name: 'All', value: 'all' }, { name: 'web', value: 'web' }, 
          { name: 'news', value: 'news' }, { name: 'google shopping', value: 'froogle' }
        ];
        $scope.periodTypes = [
          { name: 'All', value: 'all' }, { name: '30 days', value: 1 }, { name: '90 days', value: 3 }
        ];
        $scope.searchType = $scope.searchTypes[0];
        $scope.periodType = $scope.periodTypes[0];

        //functions
        var uiqueNone = function(arr) {
          var flag = true;
          for(var i = 0; i < arr.length; i++) {
            if(arr[i].name == nonStr ||   arr[i].name == 'All') flag = false;
          }
          return flag;
        }

        if(uiqueNone($scope.categories)) $scope.categories.unshift({ name: 'All' });
        
        
        //function definition
        $scope.categoryChange = function(n) {
          switch (n) {
            case 'a':
              if( $scope.category.children) {
                if(uiqueNone($scope.category.children)) $scope.category.children.unshift({ name: nonStr });
              }
              break;
            case 'b':
              if ($scope.sub_1) {
                if ($scope.sub_1.children) {
                  if ($scope.sub_1.children.length) {
                    if(uiqueNone($scope.sub_1.children)) $scope.sub_1.children.unshift({ name: nonStr });
                  }
                }
              }
              break;
            case 'c':
              if ($scope.sub_2) {
                if ($scope.sub_2.children) {
                  if ($scope.sub_2.children.length) {
                    if(uiqueNone($scope.sub_2.children)) $scope.sub_2.children.unshift({ name: nonStr });
                  }
                }
              }
              break;
          }
          $scope.filterChanged();
        }
        function getYMD(date) {
          var dateObj = date;
          var month = dateObj.getMonth() + 1; //months from 1-12
          var day = dateObj.getDate();
          var year = dateObj.getFullYear();
          var newdate = year + "-" + month + "-" + day;
          return newdate;
        }
        $scope.filterChanged = function() {
          if(!$scope.date) {
            $scope.date = new Date();
          }
          var sendFilterData = {
            'searchType': $scope.searchType,
            'date': $scope.date,
            'periodType': $scope.periodType,
            'category': $scope.category,
            'sub_1': $scope.sub_1,
            'sub_2': $scope.sub_2,
            'sub_3': $scope.sub_3,
          }
          $scope.call({ filterData: sendFilterData });
        }
      }
    };
  }).name;
