import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Content } from '../content.model';
import { ApiService } from '../services/api.service';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {


  hide = true;
  addForm!:FormGroup;
  selectedImage:File| null=null;

  url=""; //!!
  isChange!: boolean;

  constructor(private formBuilder:FormBuilder,
              private api:ApiService) { }

  ngOnInit(): void {

  this.isChange=false;
    this.addForm = this.formBuilder.group({
      address:['',Validators.required],
      desc:['',Validators.required],
      image:['',Validators.required],
      //userId:new FormControl()
    });
    this.resetForm();
  }



  onFileSelected(event: any){
    this.selectedImage=event.srcElement.files[0];
    const fd = new FormData();

    if(this.selectedImage){
      var reader = new FileReader();
      reader.readAsDataURL(this.selectedImage);
      reader.onload=
        (event:any)=>{
          this.url=event.srcElement.result;
        };
      fd.append('image',<File>this.selectedImage,this.selectedImage.name);
      this.isChange=true;

     return fd;
  }
  else{
    console.log("Null Image!!");
    this.selectedImage=null;

    return null;
  }
  }

  add(postData:Content){
    postData.imgURL=this.url;
        this.api.postContent(postData).subscribe(
          res=>{
            console.log(res);
            this.resetForm();
            alert("Your Application Published Successfully ^_^");
          }
        );

  }

  resetForm(){
    this.addForm.reset();
    this.selectedImage=null;
    this.isChange=false;
  }

}
