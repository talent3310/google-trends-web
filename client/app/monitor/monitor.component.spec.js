'use strict';

describe('Component: MonitorComponent', function() {
  // load the controller's module
  beforeEach(module('webApp.monitor'));

  var MonitorComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    MonitorComponent = $componentController('monitor', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
