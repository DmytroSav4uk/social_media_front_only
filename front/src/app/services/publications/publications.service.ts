import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {urls} from "../../configs/urls";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  constructor(private httpClient:HttpClient) { }


  getMyPublications(): Observable<any>{
    return this.httpClient.get<any>(urls.publications.myPublications)
  }


  getPublicationsByUserId(id:number): Observable<any>{
    return this.httpClient.get<any>(urls.publications.publicationsByUser + id)
  }

  getPublicationById(id:number): Observable<any>{
    return this.httpClient.get<any>(urls.publications.publications +'/'+ id)
  }


  deletePublication(id:number): Observable<any>{
    return this.httpClient.delete<any>(urls.publications.publications +'/'+ id)
  }

  like(id:number): Observable<any>{
    return this.httpClient.patch<any>(urls.publications.like + id,{})
  }

  comment(id:number,comment:any): Observable<any>{
    return this.httpClient.patch<any>(urls.publications.comment + id,comment)
  }


  postPublication(body:any): Observable<any>{
    return this.httpClient.post<any>(urls.publications.publications, body)
  }

}
