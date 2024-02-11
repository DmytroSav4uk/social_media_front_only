import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {urls} from "../../configs/urls";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getAll(nickname: string): Observable<any>{
    return this.httpClient.get<any>(urls.user.all + '?page=1&order=name&filter=' + nickname)
  }

}
