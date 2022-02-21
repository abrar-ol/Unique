import { AuthService } from './../services/auth.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  hide = true;
  loginForm!:FormGroup;
  isLoading=false;
  error!:string;

  constructor(private formBuilder:FormBuilder,
              private authservice:AuthService,
              private dialogRef:MatDialogRef<LoginComponent>,
              private router:Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });
  }

  login(){
    const email=this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    this.isLoading=true;
    this.authservice.login(email,password).subscribe(
      (res)=>{
        this.loginForm.reset();
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

  // login(){
  //   this.api.getUser().subscribe(res=>{
  //     const user = res.find((a:any)=>{
  //       return a.email === this.loginForm.value.email && a.password === this.loginForm.value.password
  //     });
  //     if(user){
  //     alert("Welcom Back "+user.name);
  //     this.loginForm.reset();
  //     this.dialogRef.close();
  //     }else{
  //       alert("User Not Found!");
  //     }
  //   },err=>{
  //     alert("Error!");
  //   }
  //   );
  // }

}
