import { AuthService } from './auth.service';
import { User } from './../user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Content } from '../content.model';
import { catchError, map, tap } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient,private authService:AuthService, private firebase: AngularFireDatabase) { }

  postUser(data: User){
    return this.http.post<User>('https://unique-f6879-default-rtdb.firebaseio.com/users.json',data);
  }
  getUser(){
    return this.http.get<User>('https://unique-f6879-default-rtdb.firebaseio.com/users.json');
  }


  // getUserByEmail(email:string){
  //   return this.http.get<User>('https://unique-f6879-default-rtdb.firebaseio.com/users.json').pipe(
  //     map((users) => {


  //       return users;
  //     })
  //   );
  // }

  postContent(postData:Content){
    return this.http.post<{name:string}>('https://unique-f6879-default-rtdb.firebaseio.com/contents.json',postData);
  }
  getContent(){
    return this.http.get<{[key:string]:Content}>('https://unique-f6879-default-rtdb.firebaseio.com/contents.json');
  }

  getContentsById(index:string){
    return this.http.get<Content>(
      'https://unique-f6879-default-rtdb.firebaseio.com/contents.json'
      )
      .pipe(
        catchError(errorRes=>{
          return this.authService.handelError(errorRes);
        })
      ,tap(resData=>{
        this.firebase.database.ref("contents").on('value', (snap) =>{
          snap.forEach((childNodes) =>{
            if(childNodes.key===index){
              console.log("Content Found (:");
              console.log(childNodes.val());
              return childNodes.val();
          }
         });
       });//on
      })//tap
      );//pipe
  }

}
