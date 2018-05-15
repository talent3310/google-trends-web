'use strict';
// @flow

type User = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default class SettingsController {
  user: User = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  errors = {
    other: undefined
  };
  message = '';
  submitted = false;
  Auth;

  /*@ngInject*/
  constructor(Auth) {
    this.Auth = Auth;
    $("#sidebar-overlay").on('click', function() {
      $("#app").removeClass("sidebar-open");
    });
    $('#sidebar-collapse-btn').on('click', function(event){
          event.preventDefault();
          
          $("#app").toggleClass("sidebar-open");
        });
  }

  changePassword(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }
}
