import { Content } from "./content.model";

export class User{
  constructor(public id:string,
              public name:string,
              public email:string,
              public password:string,
              public dob:string,
              public bio:string,
              public imgURL:string,
              public contents:Content[],
              private _token:string,
              private _tokenExpirationDate:Date

              ){}

              get token(){

                if(!this._tokenExpirationDate||new Date()>this._tokenExpirationDate)
                return null;

                return this._token;
              }

}
