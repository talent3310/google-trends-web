'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './hiddenItems.routes';

let parent;
export class HiddenItemsComponent {
  /*@ngInject*/
  constructor($loading, FeedsResource, LazyCall, $cookies, $state) {
    let self = this;
    parent = this;
    //services definition
    this.feedsResourceService = FeedsResource;
    this.$loading = $loading;
    this.lazyCallService = LazyCall;
    this.tablePerPageNum = 25;
    this.uniqueCallServerFlag = false;
    this.searchKeyword = '';
    this.selected = [];
    this.$cookies = $cookies;
    this.$state = $state;
    //initialize
    this.moveTypes = [
      { name: 'Hidden', value: 'hidden' }, { name: 'Monitor', value: 'monitor' }
    ];
    this.pageNums = {
      availableOptions: [{ name: '25', value: 25 }, { name: '50', value: 50 }, { name: '100', value: 100 }],
      selectedOption: { name: '100', value: 100 }
    }

    switch ($cookies.get('selectedNumOfPage')) {
      case '25':
        this.pageNums.selectedOption = { name: '25', value: 25 };
        this.tablePerPageNum = 25;
        break;
      case '50':
        this.pageNums.selectedOption = { name: '50', value: 50 };
        this.tablePerPageNum = 50;
        break;
      case '100':
        this.pageNums.selectedOption = { name: '100', value: 100 };
        this.tablePerPageNum = 100;
        break;
      default: 
        this.pageNums.selectedOption = { name: '25', value: 25 };
        this.tablePerPageNum = 25;
        break;
    }

    // setTimeout(function(){ self.$loading.start('feedsLoading'); }, 0);
    // this.feedsResourceService.query(function(res){
    //     console.log("res;", res);
    //     // self.$loading.finish('feedsLoading');
    // });
    $("#sidebar-overlay").on('click', function() {
      $("#app").removeClass("sidebar-open");
    });
  }
  searchKeywordSubmit(keyword) {
    parent.isLoading = true;
    var tableStateTemp = this.tableState ? this.tableState : null;
    parent.lazyCallService.getPage('hides', 0, this.tablePerPageNum, tableStateTemp, this.filterData, keyword, function(res) {
      parent.displayed = res.data;
      parent.numberOfItems = res.numberOfItems;
      parent.tableState.pagination.start = 0;
      parent.tableState.pagination.numberOfPages = res.numberOfPages;
      parent.isLoading = false;
      console.log("parent.tableState====>", parent.tableState);
      console.log('----------called from category----------', res);
    });
  }

  filterCall(filterData) {
    parent.isLoading = true;
    this.filterData = filterData;
    var tableStateTemp = this.tableState ? this.tableState : null;
    if (this.uniqueCallServerFlag) {
      parent.lazyCallService.getPage('hides', 0, this.tablePerPageNum, tableStateTemp, this.filterData, parent.searchKeyword, function(res) {
        parent.displayed = res.data;
        parent.numberOfItems = res.numberOfItems;
        parent.tableState.pagination.start = 0;
        parent.tableState.pagination.numberOfPages = res.numberOfPages;
        parent.isLoading = false;
        console.log('----------called from category----------', res);
      });
    }
  }

  callServer(tableState) {
    parent.isLoading = true;
    parent.tableState = tableState;
    var pagination = tableState.pagination;

    var start = pagination.start || 0; // This is NOT the page number, but the index of item in the list that you want to use to display the table.
    var number = pagination.number || 10; // Number of entries showed per page.

    parent.lazyCallService.getPage('hides', start, number, tableState, parent.filterData, parent.searchKeyword, function(res) {
      parent.displayed = res.data;
      parent.numberOfItems = res.numberOfItems;
      tableState.pagination.numberOfPages = res.numberOfPages;
      parent.isLoading = false;
      console.log('----------called from table----------', res);
    });

    parent.uniqueCallServerFlag = true;
  }

  filterCategories(row) {
    if (!row.sub_1) {
      return row.category;
    } else if (!row.sub_2) {
      return row.category + ' → ' + row.sub_1;
    } else if (!row.sub_3) {
      return row.category + ' → ' + row.sub_1 + ' → ' + row.sub_2;
    } else {
      return row.category + ' → ' + row.sub_1 + ' → ' + row.sub_2 + ' → ' + row.sub_3;
    }
  }

  selectAll(collection) {
    let self = this;
    // if there are no items in the 'selected' array, 
    // push all elements to 'selected'
    if (this.selected.length === 0) {
      angular.forEach(collection, function(val) {
        self.selected.push(val._id);
      });
      // if there are items in the 'selected' array, 
      // add only those that ar not
    } else if (this.selected.length > 0 && this.selected.length != this.displayed.length) {
      angular.forEach(collection, function(val) {
        var found = self.selected.indexOf(val._id);
        if (found == -1) self.selected.push(val._id);
      });
      // Otherwise, remove all items
    } else {
      this.selected = [];
    }
  }

  select(id) {
    var found = this.selected.indexOf(id);    
    if(found == -1) this.selected.push(id);    
    else this.selected.splice(found, 1);
  }

  unhide(category) {
    let self = this;
    
    if(!this.selected.length) {
      alert('Please select the items');
      return;
    }
    self.$loading.start('feedsLoading');
    this.feedsResourceService.unhide({
      ids: this.selected
    }, function(res) {
      for (var i = 0; i < self.selected.length; i++) {
        for (var k = 0; k < self.displayed.length; k++) {
          if (self.displayed[k]._id == self.selected[i]) {
            self.displayed.splice(k, 1);
          }
        }
      }
      self.numberOfItems -= self.selected.length;
      self.$loading.finish('feedsLoading');
      self.selected = [];
    }, function(err) {
      alert('Failed!');
      self.$loading.finish('feedsLoading');
    });
    
  }
  pageNumChange(option) {
    this.$cookies.put('selectedNumOfPage', option.name);
    this.tablePerPageNum = option.value;
  }
}

HiddenItemsComponent.$inject = ['$loading', 'FeedsResource', 'LazyCall', '$cookies', '$state'];

export default angular.module('webApp.hiddenItems', [uiRouter])
  .config(routes)
  .component('hiddenItems', {
    template: require('./hiddenItems.html'),
    controller: HiddenItemsComponent,
  })
  .name;
