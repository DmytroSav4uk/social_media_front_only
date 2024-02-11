import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../../interfaces/user";
import {urls} from "../../configs/urls";

@Injectable({
  providedIn: 'root'
})
export class AuthRegService {

  constructor(private httpClient: HttpClient) {
  }

  register(user: User):Observable<User>{
    return this.httpClient.post<User>(urls.authReg.register, user)
  }

  auth(user: User):Observable<User>{
    return this.httpClient.post<User>(urls.authReg.auth, user)
  }

  refreshToken(token: any):Observable<any>{
    console.log(JSON.stringify(token))
    return this.httpClient.post<any>(urls.authReg.refresh,token)
  }
}
