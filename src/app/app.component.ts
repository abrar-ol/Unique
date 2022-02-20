import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { ApiService } from './services/api.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { SignupComponent } from './signup/signup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy{

  isAuth=false;
  private userSub!: Subscription;

  constructor(private dialog: MatDialog,
              private authService:AuthService) {}

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit(): void {
    console.log("ngOnInit of AppComponent");
    this.authService.autoLogin();
    this.userSub=this.authService.user.subscribe(user=>{
      this.isAuth=!!user;
    });
  }


  logout(){
    this.authService.logout();
    this.openLoginDialog();
  }

  openSignupDialog() {
   let dialogRef= this.dialog.open(SignupComponent, {width:"30%"});
   dialogRef.afterClosed().subscribe(res=>{
    console.log("Dialog Res afterClosed: ");
    console.log(res);
  });
  }
  openLoginDialog(){
    let dialogRef= this.dialog.open(LoginComponent, {data:{name:'testName'},width:"30%"});
    dialogRef.afterClosed().subscribe(res=>{
      console.log("Dialog Res afterClosed: ");
      console.log(res);
    });
  }

}
