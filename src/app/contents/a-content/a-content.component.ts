import { Content } from './../../content.model';
import { ApiService } from './../../services/api.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { threadId } from 'worker_threads';

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


  constructor(private router:Router,private api:ApiService) { }

  ngOnInit(): void {
  //  const id = this.route.snapshot.params['id'];
  //  this.route.params.subscribe((params:Params)=>{
  //   this.id= +params['id'];
  //   this.api.getContentsById(this.id).subscribe(
  //     (res)=>{this.contents=res},
  //     (errorMessage)=>{console.log(errorMessage);}
  //     );
  //  });

  }

  // public testClick(index:string){
  //   console.log("Click index: "+index);

  // }

  onClick(selectedContent:Content){
    this.router.navigate(['/details',selectedContent.id]);
  }

}
