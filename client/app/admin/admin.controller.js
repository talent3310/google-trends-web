'use strict';

import angular from 'angular';

type User = {
  name: string;
  email: string;
  password: string;
};

export default class AdminController {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {};
  submitted = false;
  Auth;


  /*@ngInject*/
  constructor(User, Auth) {
    this.Auth = Auth;
    this.User = User;
    // Use the User $resource to fetch all users
    this.rowCollection = User.query();
    console.log("this.rowCollection", this.rowCollection);
  }

  delete(row) {
    row.$remove();
    this.rowCollection.splice(this.rowCollection.indexOf(row), 1);
  }

  register(form) {
    var self = this;
    this.submitted = true;
    if(form.$valid) {
      return this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          self.rowCollection = self.User.query();
          alert('success!')
        })
        .catch(err => {
          alert("Failed in creating the user: ", err);
        });
    }
  }
}
