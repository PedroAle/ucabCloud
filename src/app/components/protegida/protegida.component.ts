import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule
} from '@angular/forms';
import { SocketsService } from 'src/app/services/sockets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-protegida',
  templateUrl: './protegida.component.html',
  styleUrls: ['./protegida.component.css']
})
export class ProtegidaComponent implements OnInit {

  public registrationForm: FormGroup = new FormGroup({
    firstname: new FormControl(null, [

    ]),
    lastname: new FormControl(null, [

    ]),
    userName: new FormControl(null, [
    ]),
    password: new FormControl(null, [
    ]),
  });

  constructor(private socketsService: SocketsService, private _router: Router) { }

  ngOnInit() {
  }

  public createUserName():void {
    let user = {
      firstname: this.registrationForm.get('firstname').value,
      lastname: this.registrationForm.get('lastname').value,
      name: this.registrationForm.get('userName').value,
      password: this.registrationForm.get('password').value 
    }
    this.socketsService.createUser(user);
    this._router.navigate(['/home']);
  }

  public goToLogin(){
    this._router.navigate(['/home']);
  }

}
