import { Component, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelpDeskService } from '../help-desk.service';
import { User } from './User';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [HttpClient]
})
/** User component **/
export class UserComponent {
    //array of users
  public users: User[] = [];
  public postUser: HttpClient = null;
  //this will be the base url 
  public apiBase: string = "";
  public http: HttpClient = null;


  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, public route:Router ,  public LoginService: LoginService) {
    this.apiBase = baseUrl;
    this.http = http;

    http.get<User[]>(this.apiBase + 'api/users').subscribe(result => {
      this.users = result;
      console.log(this.users);
    }, error => console.error(error));

  }

  //will call API and update the display
  public displayUser(http: HttpClient): User[]{
    http.get<User[]>(this.apiBase + 'api/users').subscribe(result => {
      this.users = result;
      console.log(this.users);
    }, error => console.error(error));
    return this.users;
  }

  //put will create a new user and add it to the database
  addUser(form: NgForm) {
    let name: string = form.form.value.name;
    this.http.post<User>(this.apiBase + 'api/users?name=' + name, {}).subscribe(result => {
      console.log(result)
      let u: User = { name: name, userID: this.users.length };
      this.users.push(u);

    });
  }



  //will recall page and display updated user list
  buttonSubmit(form: NgForm) {
    this.addUser(form);
    this.displayUser(this.http);
  }

  //this is select the user and route to a ticket page
  //it is a router object and navigate by URL
  selectUser(form: NgForm) {
    if (form.form.value !== undefined) {
      this.LoginService.login(form.form.value)
      this.route.navigateByUrl('/tickets');
    }
  }



  //DELETE user -- this function will delete a user from the DB
  deleteUser(form: NgForm) {
    let id = form.form.value.deleteUser;
    this.http.delete<User>(this.apiBase + 'api/users/' + id, {}).subscribe(results => {
      console.log(results)
    });
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userID === id) {
        this.users.splice(id, 1);
      }
    }
  }
  //constructor(private user: HelpDeskService, @Inject('BASE_URL') baseUrl: string) {
  //  this.user.getUser();
  //  console.log(this.user.getUser());
  //}

  //getUser() {
  //  this.user.getUser()
  //    .subscribe((user: any))=> {
  //    this.user=
    
  //}
}
