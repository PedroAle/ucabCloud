import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  private url = 'http://localhost:3000';
  private socket; 

  constructor(private _router: Router) { 
    this.socket = io(this.url);
  }

  public createUser(data) {
    this.socket.emit('USER_REGISTER', data);
  }

  public login(data){
    this.socket.emit('USER_LOGIN', data)
  }

  public getuser(){
    this.socket.on('USER_LOGGED', data => {
      if(data) {
        this._router.navigate(['/precios',data.name]);
      }
    })
  }

  public createFolder(data){
    this.socket.emit('folder', data);
  }

}
