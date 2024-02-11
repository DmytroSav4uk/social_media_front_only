import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {urls} from "../../configs/urls";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private httpClient: HttpClient) { }

  getMyFriends(): Observable<any>{
    return this.httpClient.get<any>(urls.friends.myFriends)
  }


  getPending(): Observable<any>{
    return this.httpClient.get<any>(urls.friends.pending)
  }

  sendFriendRequest(id:number): Observable<any>{
    return this.httpClient.post<any>(urls.friends.sendRequest + id,{})
  }

  accept(id:number): Observable<any>{
    return this.httpClient.post<any>(urls.friends.accept + id,{})
  }

  deny(id:number): Observable<any>{
    return this.httpClient.post<any>(urls.friends.deny + id,{})
  }


}
