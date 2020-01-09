import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private url = 'http://192.168.8.100:3000';
  private socket;

  userName = 'admin';
  users = [];

  constructor(private _router: Router) {
    this.socket = io(this.url);
  } 

  ngOnInit() {
    
    this.socket.emit("getUsers", {username: 'admin'});

    this.socket.on('usersOn', data => {
      this.users = data;
    })
    
  }

  getUsers () {
    this.socket.emit("getUsers", {username: 'admin'});
  }

  deleteUser(user) {
    this.socket.emit("deleteUser", { name: user.name });
    this.getUsers();
  }

  goBack(){
    this._router.navigate(['/precios/admin']);
  }

  goHome(){
    this._router.navigate(['/home']);
  }

}
