import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as io from 'socket.io-client';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule
} from '@angular/forms';
import { SocketsService } from 'src/app/services/sockets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  private url = 'http://192.168.8.100:3000';
  private socket;
  userUnknown;

  public registrationForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required,Validators.minLength(5)]),
    password: new FormControl(null, [Validators.required,Validators.minLength(5)]),
  });

  constructor(private socketsService: SocketsService, private _router: Router) { 
    this.socket = io(this.url);
  }

  ngOnInit() {
    this.socketsService.getuser();
    this.userUnknown = this.socketsService.userUnknown();
  }

  public login():void {
    let user = {
      name: this.registrationForm.get('userName').value,
      password: this.encryptData(this.registrationForm.get('password').value)
    }
    console.log(user.password)

    this.socketsService.login(user);

  }

  goToSignup(){
    this._router.navigate(['/protegida']);
  }


encryptData(data) {

  try {
    return (CryptoJS.SHA256(data, "Key")['words'][0]);
  } catch (e) {
    console.log(e);
  }
}

}
