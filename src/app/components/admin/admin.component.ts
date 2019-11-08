import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketsService } from 'src/app/services/sockets.service';
import * as io from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private url = 'http://localhost:3000';
  private socket;

  folder;

  userName = 'admin';

  filess = {};
  struct = { 
      name: null, 
      type: null, 
      size: 0, 
      data: []
  };

  inFolder = false;
  cFolder = false;

  uploadPercent;

  users = [];

  constructor(private socketService: SocketsService, private _activatedRoute: ActivatedRoute, private _router: Router, private modalService: ModalService) {
    this.socket = io(this.url);
  } 

  ngOnInit() {
    
    this.socket.on("uploaded", data => {
      this.uploadPercent = 100;
      console.log("File uploaded successfully");
    });

    this.socket.on("error", data => {
      console.log("File didn't upload");
    });

    this.socket.emit("getUsers", {username: 'admin'});

    this.socket.on('usersOn', data => {
      this.users = data;
      console.log("epaaa", this.users)
    })

    this.socket.on('userFilesFolder', data => {
      this.users = data;
      console.log("epaaa2", this.users)
    })

    this.socket.on('uploaded', () => {
      console.log('llegue')
      //this.getFiles()
    })

    this.socket.on('fileReceived', (data, info) => {
      if (info.type == 'png'){
        this.downLoadFile(data.file, {type: 'image/png'}, info.filename, info.type)
      }

      if (info.type == 'jpg'){
        this.downLoadFile(data.file, {type: 'image/jpg'}, info.filename, info.type)
      }

      if (info.type == 'pdf'){
        this.downLoadFile(data.file, {type: 'application/pdf'}, info.filename, info.type)
      }

      if (info.type == 'mp3'){
        this.downLoadFile(data.file, {type: 'audio/mp3'}, info.filename, info.type)
      }

      if (info.type == 'txt'){
        this.downLoadFile(data.file, {type: 'text/plain'}, info.filename, info.type)
      }

      if (info.type == 'docx'){
        this.downLoadFile(data.file, {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}, info.filename, info.type)
      }

      if (info.type == 'pptx'){
        this.downLoadFile(data.file, {type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'}, info.filename, info.type)
      }

      if (info.type == 'xls'){
        this.downLoadFile(data.file, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'}, info.filename, info.type)
      }
      
      console.log('llegue', data)
      
    })
  }

  getUsers () {
    this.socket.emit("getUsers", {username: 'admin'});
  }

  getFile (){
    console.log("llegueee");
    
    this.socket.on('fileReceived', (data, info) => {
      if (info.type == 'png'){
        this.downLoadFile(data.file, {type: 'image/png'}, info.filename, info.type)
      }

      if (info.type == 'jpg'){
        this.downLoadFile(data.file, {type: 'image/jpg'}, info.filename, info.type)
      }

      if (info.type == 'pdf'){
        this.downLoadFile(data.file, {type: 'application/pdf'}, info.filename, info.type)
      }

      if (info.type == 'mp3'){
        this.downLoadFile(data.file, {type: 'audio/mp3'}, info.filename, info.type)
      }

      if (info.type == 'txt'){
        this.downLoadFile(data.file, {type: 'text/plain'}, info.filename, info.type)
      }

      if (info.type == 'docx'){
        this.downLoadFile(data.file, {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}, info.filename, info.type)
      }

      if (info.type == 'pptx'){
        this.downLoadFile(data.file, {type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'}, info.filename, info.type)
      }

      if (info.type == 'xls'){
        this.downLoadFile(data.file, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'}, info.filename, info.type)
      }
      
      console.log('llegue', data)
      
    })
  }

  async downLoadFile(data: any, type, name, typ) {
    let blob = new Blob([data], type);
    let link = document.createElement('a');
    link.download = name + '.' + typ;

    let reader = new FileReader();
    reader.readAsDataURL(<File>blob); // converts the blob to base64 and calls onload

    reader.onload = function() {
      link.href = reader.result.toString(); // data url
      link.click();
    }
  }

  deleteUser(user) {
    this.socket.emit("deleteUser", { name: user.name });
    this.getUsers();
  }

  getInfoFolder(){
    this.socket.emit('getFilesFolder', {  user: this.userName, folder: this.folder})
  }

  getFilesFolder(file){
    this.folder = file.name;
    this.socket.emit('getFilesFolder', {  user: this.userName, folder: this.folder});
    this.inFolder = true;
    console.log(this.folder);
    
    //this.socket.emit('getFilesFolder', {  user: this.userName, folder: file.folder})
  }

  update(){
    //this.getFiles();
    //this.getFile();
  }

  goBack(){
    this._router.navigate(['/precios/admin']);
  }

  goHome(){
    this._router.navigate(['/home']);
  }

  folderF(){
    this.cFolder = true;
  }

  cancelFolder(){
    this.cFolder = false;
  }

  administration(){
this._router.navigate(['/admin'])
  }

}
