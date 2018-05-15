'use strict';

describe('Component: FeedsComponent', function() {
  // load the controller's module
  beforeEach(module('webApp.feeds'));

  var FeedsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    FeedsComponent = $componentController('feeds', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
