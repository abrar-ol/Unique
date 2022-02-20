import { User } from './../../user.model';
import { Content } from './../../content.model';
import { ApiService } from './../../services/api.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { threadId } from 'worker_threads';
import { catchError, tap } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-a-content',
  templateUrl: './a-content.component.html',
  styleUrls: ['./a-content.component.scss']
})
export class AContentComponent implements OnInit {
  id!:number;
  contents!:Content[];

  @Input() content!:Content;
  @Input() index!:string|undefined;
  user!:User;


  constructor(private router:Router,private api:ApiService,private firebase: AngularFireDatabase,private authService:AuthService) { }

  ngOnInit(): void {
  //  const id = this.route.snapshot.params['id'];
  //  this.route.params.subscribe((params:Params)=>{
  //   this.id= +params['id'];
  //   this.api.getContentsById(this.id).subscribe(
  //     (res)=>{this.contents=res},
  //     (errorMessage)=>{console.log(errorMessage);}
  //     );
  //  });

  this.api.getUser()
  .pipe(
    catchError(errorRes=>{
      return this.authService.handelError(errorRes);
    })
  ,tap(resData=>{
    this.firebase.database.ref("users").on('value', (snap) =>{
      snap.forEach((childNodes) =>{
        if(childNodes.val().id=== this.content.userId){
          console.log("User Found (:");
          console.log(childNodes.val());
          return childNodes.val();
      }
     }
     );

   });//on
  })//tap
  )//pipe
  .subscribe(res=>{
    this.user=res;
  });

    console.log("user Name: "+this.user.name);


  }

  // public testClick(index:string){
  //   console.log("Click index: "+index);

  // }

  onClick(selectedContent:Content){
    this.router.navigate(['/details',selectedContent.id]);
  }

}
