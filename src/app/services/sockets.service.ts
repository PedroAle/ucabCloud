import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  private url = 'http://192.168.8.100:3000';
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

  public userUnknown(){
    var cont = 1;
    this.socket.on('USER_UNKNOWN', data => {
      if (data){
        alert("Usuario No Registrado")
      }
    })
    this.socket.on('PASSWORD', data => {
      if (data){
        alert("Contraseña Incorrecta")
      }
    })
    if (cont == 1){
      console.log("entre")
      return cont
    }
  }

  public userRegistered(){
    this.socket.on('USER_REGISTERED', data => {
      if (data){
        this._router.navigate(['/home']);
      }
    })
  }

  public userExisted(){
    this.socket.on('USER_EXISTED', data => {
      if (data){
        alert("Usuario Ya Registrado")
      }
    })
  }

}
