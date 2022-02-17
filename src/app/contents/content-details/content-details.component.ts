import { ApiService } from './../../services/api.service';
import { Content } from './../../content.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content-details',
  templateUrl: './content-details.component.html',
  styleUrls: ['./content-details.component.scss']
})
export class ContentDetailsComponent implements OnInit {

  content!:Content;
  constructor(private api:ApiService,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res=>{
      let id:string =res['id'];
      this.api.getContentsById(id)
      .subscribe(res=>{
      console.log("res "+res.address);
      this.content=res;
    });
  });

}

}
