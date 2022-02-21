import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Content } from '../content.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit {
  contents: Content[]=[];
  isFetching=false;


  constructor( private api:ApiService ) { }



  ngOnInit(): void {
    this.getAllContents();
  }

  getAllContents(){
    this.isFetching=true;
    this.api
    .getContent()
    .pipe(
      map(responseData=>{
      const postArray:Content[]=[];
      for(const key in responseData){
        if(responseData.hasOwnProperty(key))
        postArray.push({...responseData[key],id:key});
      }
      return postArray;
    }))
    .subscribe({

      next:(res)=>{
        this.contents=res;
        console.log(res);
        this.isFetching=false
      },
      error:()=>{alert("Error Getting Contents!!")}
    });
  }

}
