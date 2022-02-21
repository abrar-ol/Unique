import { Content } from './../content.model';
import { User } from './../user.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!:FormGroup;

  hide = true;
  isLoading=false;
  error!:string;
  isChange!: boolean;
  selectedImage:File| null=null;
  url=""; //!!

  constructor(private formBuilder:FormBuilder,
              private api:ApiService,
              private dialogRef:MatDialogRef<SignupComponent>,
              private authService:AuthService) { }

  ngOnInit(): void {
    this.isChange=false;

    this.signupForm=this.formBuilder.group({
      name:['',Validators.required],
     email:['',[Validators.required, Validators.email]],
     password:['', Validators.compose([
      Validators.minLength(5),
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$') //this is for the letters (both uppercase and lowercase) and numbers validation
   ])],
   date:['',Validators.required],
   bio:['',Validators.required],
   image:['',Validators.required]
    });
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


  signup(){
    if(this.signupForm.valid){

      const email=this.signupForm.controls['email'].value;
      const password = this.signupForm.controls['password'].value;
      const name = this.signupForm.controls['name'].value;
      const dob = this.signupForm.controls['date'].value;
      const bio = this.signupForm.controls['bio'].value;
      const imgURL = this.url;
      const contents:Content[] = [];
      this.isLoading=true;
      this.authService.signup(email,password,name,dob,bio,imgURL,contents).subscribe(
        (res)=>{
          alert("Welcome "+this.signupForm.controls["name"].value+" ^-^");
          this.signupForm.reset();
          this.dialogRef.close('save');
          this.isLoading=false;
        },
        (errorMessage)=>{
          console.log(errorMessage);

          this.error=errorMessage
          this.isLoading=false;
        }
      );
    }

    // if(this.signupForm.valid){
    //   this.api.postUser(this.signupForm.value).subscribe({
    //     next:(res)=>{

    //     },
    //     error:(err)=>{
    //       alert("Error: "+err);
    //     }
    //   });
    // }
        console.log(this.signupForm.get('date')?.value.toObject().date+"/"+
        this.signupForm.get('date')?.value.toObject().months+"/"+
        this.signupForm.get('date')?.value.toObject().years);
  }

  getEmailErrorMessage() {
    if (this.signupForm.controls['email'].hasError('required')) {
      return 'You must enter valid E-mail';
    }

    return this.signupForm.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  getPassworErrorMessage() {
    if (this.signupForm.controls['password'].hasError('required')) {
      return 'You must enter Password!';
    }
    else if(this.signupForm.controls['password'].hasError('minlength') ){
      return 'Length Must be greater than 5'
    }
    else if(this.signupForm.controls['password'].hasError('pattern') ){
      return 'You must enter UpperCase, lowerCase and number'
    } else{
      return 'Un Expected Error'
    }
  }

}
