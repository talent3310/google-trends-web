'use strict';

describe('Component: HiddenItemsComponent', function() {
  // load the controller's module
  beforeEach(module('webApp.hiddenItems'));

  var HiddenItemsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    HiddenItemsComponent = $componentController('hiddenItems', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
