import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule
} from '@angular/forms';
import { SocketsService } from 'src/app/services/sockets.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  subscription: Subscription;

  public registrationForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [
    ]),
    password: new FormControl(null, [
    ]),
  });

  constructor(private socketsService: SocketsService, private _router: Router) { }

  ngOnInit() {
    this.updating();
  }

  public login():void {
    let user = {
      name: this.registrationForm.get('userName').value,
      password: this.registrationForm.get('password').value 
    }
    this.socketsService.login(user);

  }

  getLogin(){
    this.socketsService.getuser();
  }

  updating(){
    const source = interval(2500);
    this.subscription = source.subscribe(val => this.update());
  }

  update(){
    this.getLogin();
  }

  goToSignup(){
    this._router.navigate(['/protegida']);
  }

}
