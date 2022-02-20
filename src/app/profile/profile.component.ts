import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { User } from '../user.model';
import { catchError, tap } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  constructor(private authService:AuthService, private api:ApiService, private firebase: AngularFireDatabase) { }
  user!:User;
  isLoading=false;
  error!:string;

  ngOnInit(): void {

    if(this.authService.user.value!=null){
      this.isLoading=true;
      this.api.getUser()
      .pipe(
        catchError(errorRes=>{
          return this.authService.handelError(errorRes);
        })
      ,tap(resData=>{
        this.firebase.database.ref("users").on('value', (snap) =>{
          snap.forEach((childNodes) =>{
            if(childNodes.val().id===this.authService.user.value?.id){
              console.log("User Found (:");
              console.log(childNodes.val());
              this.user= childNodes.val();
              this.isLoading=false;
          }
         }
         );

       });//on
      })//tap
      )//pipe
      .subscribe(res=>{},
        (errorMessage)=>{
          console.log(errorMessage);

          this.error=errorMessage
          this.isLoading=false;}
        );
    }else{
      console.log("undefiend user");
    }

  }

}
