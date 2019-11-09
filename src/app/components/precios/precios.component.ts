import { Component, OnInit, ViewChild } from '@angular/core';
import { SocketsService } from 'src/app/services/sockets.service';
import * as io from 'socket.io-client';
import { FileUploader } from 'ng2-file-upload';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal.service';
import {saveAs as importedSaveAs} from "file-saver";

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.css']
})

export class PreciosComponent implements OnInit {
  
  subscription: Subscription;

  public Form: FormGroup = new FormGroup({
    file: new FormControl(null, [
    ])
  });

  public folderForm: FormGroup = new FormGroup({
    folder: new FormControl(null, [
    ])
  });

  public moveForm: FormGroup = new FormGroup({
    move: new FormControl(null, [
    ])
  });

  folder;

  userName;

  filess = {};
  struct = { 
      name: null, 
      type: null, 
      size: 0, 
      data: []
  };

  private url = 'http://localhost:3000';
  private socket;

  title = 'angular-file-upload';
  public uploader:FileUploader = new FileUploader({url:'http://localhost:3001/upload'});

  selectedFile;
  fReader;
  name;
  type;
  size; 
  slice;

  inFolder = false;
  cFolder = false;

  uploadPercent;

  files = [];

  constructor(private socketService: SocketsService, private _activatedRoute: ActivatedRoute, private _router: Router, private modalService: ModalService) {
    this.socket = io(this.url);
    this._activatedRoute.params.subscribe( params => {
      this.userName = params['user'];
      console.log( params['user']);
    });
  } 

  ngOnInit() {
    
    this.socket.on("uploaded", data => {
      this.uploadPercent = 100;
      console.log("File uploaded successfully");
    });

    this.socket.on("error", data => {
      console.log("File didn't upload");
    });

    this.socket.emit("getFiles", {username: this.userName});

    this.socket.on('userFiles', data => {
      this.files = data;
      console.log("epaaa", this.files)
    })

    this.socket.on('userFilesFolder', data => {
      this.files = data;
      console.log("epaaa2", this.files)
    })

    this.socket.on('uploaded', () => {
      console.log('llegue')
      this.getFiles()
    })

    /////
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

    this.socket.on('fileReceivedPreview', (data, info) => {
      if (info.type == 'png'){
        this.seePreview(data.file, {type: 'image/png'}, info.filename, info.type)
      }

      if (info.type == 'jpg'){
        this.seePreview(data.file, {type: 'image/jpg'}, info.filename, info.type)
      }

      if (info.type == 'pdf'){
        this.seePreview(data.file, {type: 'application/pdf'}, info.filename, info.type)
      }

      if (info.type == 'mp3'){
        this.seePreview(data.file, {type: 'audio/mp3'}, info.filename, info.type)
      }

      if (info.type == 'txt'){
        this.seePreview(data.file, {type: 'text/plain'}, info.filename, info.type)
      }

      if (info.type == 'docx'){
        this.seePreview(data.file, {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}, info.filename, info.type)
      }

      if (info.type == 'pptx'){
        this.seePreview(data.file, {type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'}, info.filename, info.type)
      }

      if (info.type == 'xls'){
        this.seePreview(data.file, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'}, info.filename, info.type)
      }
      
      console.log('llegue', data)
      
    })
    ////
    this.updating();
  }

  seePreview(data: any, type, name, typ){
    let blob = new Blob([data], type);
    var objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl);
  }

  getFiles () {
    this.socket.emit("getFiles", {username: this.userName});
    this.inFolder = false;
    /* this.socket.on('userFiles', data => {
      this.files = data;
    }); */

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
    importedSaveAs(blob, name);
    /* let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.click(); */
   /*  window.URL.revokeObjectURL(url);
    a.remove();
    let link = document.createElement('a');
    link.download = name + '.' + typ;
    var objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl); */

    /* var b: any = blob; */
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    /* b.lastModifiedDate = new Date();
    b.name = 'fileName.pdf'; */

    //Cast to a File() type

    /* let reader = new FileReader();
    reader.readAsDataURL(blob); // converts the blob to base64 and calls onload

     reader.onload = function() {
      link.href = reader.result.toString(); // data url
      link.click();
    } */
  }

  deleteFile(file) {
    this.socket.emit("deleteFile", {username: this.userName, name: file.name, type: file.type, folder: file.folder});
    this.getFiles();
  }

  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    this.name = this.selectedFile.name;
    this.type = this.selectedFile.type;
    this.size = this.selectedFile.size;
    console.log(this.selectedFile);
  }

  upload() {
    this.fReader = new FileReader();
    this.slice = this.selectedFile.slice(0, 8192*8192); 
    this.fReader.readAsArrayBuffer(this.slice); 
    this.fReader.onload = async (evnt) => {
      var arrayBuffer = this.fReader.result;
      await this.socket.emit("upload", { name: this.name, type: this.type, size: this.size, data: arrayBuffer, userName: this.userName });
    };
    this.Form.reset({})
  }

  download(file){
    this.socket.emit('download', {filename: file.name, type: file.type , name: this.userName, folder: file.folder});
  }

  preview(file){
    this.socket.emit('preview', {filename: file.name, type: file.type , name: this.userName, folder: file.folder});
  }

  updating(){
    const source = interval(2500);
    this.subscription = source.subscribe(val => this.update());
  }
  
  createFolder(){
    let data = {
      name: this.folderForm.get('folder').value,
      type: 'folder',
      folder: '',
      data: '',
      username: this.userName
    }
    this.socket.emit('folder', data);
    //this.socketService.createFolder(data);
    this.folderForm.reset({})
    this.cFolder = false;
  }

  moveFolder(file) {
    console.log(file)
    this.socket.emit('move', {  user: this.userName, name: file.name, type: file.type, folder: this.moveForm.get('move').value, data: file.data })
    this.moveForm.reset({})
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
