'use strict';

export function LazyCall($q, $filter, $timeout, FeedsResource) {
  'ngInject';

  function getPage(type, start, number, params, filterData, keyword, callback) {
    var category = '';
    if (filterData.category && filterData.category.id != null) {
      category = filterData.category.id;
    }
    if (filterData.sub_1 && filterData.sub_1.id) {
      category += ',' + filterData.sub_1.id;
    }
    if (filterData.sub_2 && filterData.sub_2.id) {
      category += ',' + filterData.sub_2.id;
    }
    if (filterData.sub_3 && filterData.sub_3.id) {
      category += ',' + filterData.sub_3.id;
    }

    var date = filterData.date;
    var sendData = {
      type: type,
      category: category,
      keyword: keyword,
      date: date,
      period: filterData.periodType.value,
      searchType: filterData.searchType.value,
      start: start,
      number: number,
      sort: params.sort
    };

    FeedsResource.getFilteredData(sendData, function(res) {
      callback({ data: res.data, numberOfPages: res.numberOfPages, numberOfItems:  res.numberOfItems});
    });

  }
  return {
    getPage: getPage
  };
}
