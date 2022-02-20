import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { Content } from './../../content.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-content-details',
  templateUrl: './content-details.component.html',
  styleUrls: ['./content-details.component.scss']
})
export class ContentDetailsComponent implements OnInit {

  content!:Content;
  constructor(private api:ApiService,private activatedRoute: ActivatedRoute,private authService:AuthService
    , private firebase: AngularFireDatabase) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( res=>{
      let id:string =res['id'];
        this.api.getContent() .pipe(
        catchError(errorRes=>{
          return this.authService.handelError(errorRes);
        })
      ,tap(resData=>{
        this.firebase.database.ref("contents").on('value', (snap) =>{
          snap.forEach((childNodes) =>{
            if(childNodes.key===id){
              console.log("Content Found (:");
              console.log(childNodes.val());
              this.content=  childNodes.val();
          }
         });

       });//on
      })//tap
      ).subscribe(
        res=>{
          console.log("after Subscribe: "+res);
        }
      );
  });


}

}
