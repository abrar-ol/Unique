import { ApiService } from './api.service';
import { AppComponent } from './../app.component';
import { Router } from '@angular/router';
import { User } from './../user.model';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { BehaviorSubject, catchError, map, Subject, tap, throwError } from "rxjs";
import { Content } from '../content.model';
import { ifError } from 'assert';
import { AngularFireDatabase } from '@angular/fire/compat/database';


interface AuthResponseData{
  idToken:string;
  email:string;
  refreshToken:string;
  expiresIn:string;
  localId:string;
  registered?:boolean
}

@Injectable({
  providedIn:'root'
})
export class AuthService{

  user = new BehaviorSubject<User| null>(null);
  private tokenExpirationTimer:any;

  constructor(private http:HttpClient,private injector: Injector,private router:Router, private firebase: AngularFireDatabase){}

  logout(){
    this.user.next(null);
    this.router.navigate(['/', 'contents']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer= setTimeout(()=>{
      this.logout();
    }
      ,expirationDuration);
  }

  signup(email:string,password:string,name:string,dob:string,bio:string,imgURL:string){
    return this.http
    .post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxFcSkk8n_n8D1NneTaIi5kuzEYE8DPug',
    {
      email:email,
      password:password,
      returnSecureToken:true
    }
    ).pipe(
      catchError(errorRes=>{
        return this.handelError(errorRes);
      }),
      tap(resData=>{
      this.handelAuth(resData.email,resData.localId,password,resData.idToken,
        +resData.expiresIn,name,bio,imgURL,dob);
        const expirationDate = new Date(new Date().getTime() +  +resData.expiresIn*1000);
        const newUser = new User(resData.localId,name,email,password,dob,bio,imgURL,resData.idToken,expirationDate);
        const api = this.injector.get(ApiService);
        api.postUser(newUser).subscribe(
          res=>{
            console.log(res);
            alert("User Added To RealTim DB");
          }
        );
      })
    );

  }

  login(email:string,password:string){
    return this.http
    .post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDxFcSkk8n_n8D1NneTaIi5kuzEYE8DPug',
    {
      email:email,
      password:password,
      returnSecureToken:true,
    }).pipe(
      catchError(errorRes=>{
        return this.handelError(errorRes);
      })
    ,tap(resData=>{
      this.firebase.database.ref("users").on('value', (snap) =>{
        snap.forEach((childNodes) =>{
          if(childNodes.val().email===email){
            console.log("Email Found (:");

            this.handelAuth(resData.email,resData.localId,password,resData.idToken,
              +resData.expiresIn,childNodes.val().name,childNodes.val().bio,childNodes.val().imgURL,childNodes.val().dob);
              return;
        }
       });
     });//on
    })//tap
    );//pipe
  }


  private handelAuth(email:string,userId:string,password:string,token:string,expiresIn:number,
    name:string,bio:string,imgURL:string,dob:string) {

      const expirationDate = new Date(new Date().getTime() + expiresIn*1000);

      console.log("expirationDate: "+expirationDate,"expiresin: "+expiresIn);
    const newUser = new User(userId,name,email,password,dob,bio,imgURL,token,expirationDate);
      console.log("New User From handelAuth "+newUser);
    this.user.next(newUser);
    this.autoLogout(expiresIn*1000);
    localStorage.setItem('userData',JSON.stringify(newUser));
  }

  autoLogin(){
    if(localStorage.getItem('userData')){
      const userData:{
        id:string;
        name:string;
        email:string;
        password:string;
        dob:string,
        bio:string,
        imgURL:string,
        _token:string;
        _tokenExpirationDate:string;
        content?:Content;
      }=JSON.parse(localStorage.getItem('userData')|| '{}')

      if(!userData){return;}


      const loadedUser=new User(userData.id,userData.name,userData.email,userData.password
        ,userData.dob,userData.bio,userData.imgURL,userData._token,new Date(userData._tokenExpirationDate));

        console.log("token Date:"+loadedUser.token);

      if(loadedUser.token){
        this.user.next(loadedUser);
        const expirationDuration =  new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    }

  }

  public handelError(errorRes:HttpErrorResponse) {
    let errorMessage='An unkown Error Occurred!'

    if(!errorRes.error || !errorRes.error.error){return throwError(errorMessage);}

    switch(errorRes.error.error.message){
      case 'EMAIL_NOT_FOUND':
        errorMessage='EMAIL_NOT_FOUND'
        break;
      case 'INVALID_PASSWORD':
        errorMessage='INVALID_PASSWORD'
        break;
      case 'USER_DISABLED':
        errorMessage='USER_DISABLED'
        break;
      case 'EMAIL_EXISTS':
        errorMessage='This Email Already Exist'
        break;
      case 'INVALID_EMAIL':
        errorMessage='Invalid Email'
        break;
     }

     return throwError(errorMessage);
  }
}
