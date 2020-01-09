import { Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Route } from '@angular/router';
import {saveAs as importedSaveAs} from "file-saver";

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.css']
})

export class PreciosComponent implements OnInit {

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

  struct = { 
      name: null, 
      type: null, 
      size: 0, 
      data: []
  };

  order = true;

  private url = 'http://192.168.8.100:3000';
  private socket;

  selectedFile;
  fReader;
  name;
  type;
  size; 
  slice;

  inFolder = false;
  cFolder = false;

  files = [];

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router) {
    this.socket = io(this.url);
    this._activatedRoute.params.subscribe( params => {
      this.userName = params['user'];
      console.log( params['user']);
    });
  } 

  ngOnInit() {
    
    this.socket.on("uploaded", data => {
      console.log("File uploaded successfully");
    });

    this.socket.on("error", data => {
      console.log("File didn't upload");
    });

    this.socket.emit("getFiles", {username: this.userName});

    this.socket.on('userFiles', async (data)=>{
      console.log(data)
      this.files = this.sorting(data);
    })

    this.socket.on('userFilesFolder', data => {
      this.files = data.sort((a, b) => a.name > b.name);
    })

    this.socket.on('uploaded', () => {
      this.getFiles()
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

      if (info.type == 'mp4'){
        this.downLoadFile(data.file, {type: 'audio/mp4'}, info.filename, info.type)
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

      if (info.type == 'xls' || info.type == 'xlsx' || info.type == 'xlsm'){
        this.downLoadFile(data.file, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'}, info.filename, info.type)
      }
      
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

  }

  sorted(){
    this.order = !this.order
    this.getFiles();

  }

  sorting(data){
    if(this.order){
      data.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    } else {
      data.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      data.reverse()
    }
    return data
  }

  seePreview(data: any, type, name, typ){
    let blob = new Blob([data], type);
    var objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl);
  }

  getFiles () {
    this.socket.emit("getFiles", {username: this.userName});
    this.inFolder = false;
  }

  async downLoadFile(data: any, type, name, typ) {
    let blob = new Blob([data], type);
    importedSaveAs(blob, name);
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
  
  createFolder(){
    let data = {
      name: this.folderForm.get('folder').value,
      type: 'folder',
      folder: '',
      data: '',
      username: this.userName
    }
    this.socket.emit('folder', data);
    this.folderForm.reset({})
    this.cFolder = false;
  }

  moveFolder(file) {
    console.log(file)
    this.socket.emit('move', {  user: this.userName, name: file.name, type: file.type, folder: this.moveForm.get('move').value, data: file.data })
    this.moveForm.reset({})
  }

  getFilesFolder(file){
    this.folder = file.name;
    this.socket.emit('getFilesFolder', {  user: this.userName, folder: this.folder});
    this.inFolder = true;
    console.log(this.folder);
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
