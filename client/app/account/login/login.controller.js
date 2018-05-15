'use strict';
// @flow

type User = {
  name: string;
  email: string;
  password: string;
};

export default class LoginController {
  user: User = {
    name: '',
    email: '',
    password: '',
    remember_me: false
  };
  errors = {
    login: undefined
  };
  submitted = false;
  Auth;
  $state;

  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
    this.user.remember_me = true;
  }

  login(form) {
    this.submitted = true;
    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password,
        remember_me: this.user.remember_me,
      })
      .then(() => {
        // Logged in, redirect to home
        this.$state.go('feeds');
      })
      .catch(err => {
          console.log("err===>", err);
        this.errors.login = err.message;
      });
    }
  }
}
