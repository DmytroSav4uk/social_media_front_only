import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {urls} from "../../configs/urls";


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) {
  }

  change(name: any): Observable<any> {
    return this.httpClient.patch<any>(urls.profile.editProfile,name)
  }

  photoUpload(photoFile:any):Observable<any>{
    return this.httpClient.post<any>(urls.profile.uploadPhoto, photoFile)
  }

  backPhotoUpload(photoFile:any):Observable<any>{
    return this.httpClient.post<any>(urls.profile.uploadBackPhoto, photoFile)
  }

  getMyProfile(): Observable<any>{
     return this.httpClient.get<any>(urls.profile.my)
  }


  getProfileById(id:number): Observable<any>{
    return this.httpClient.get<any>(urls.profile.profile +id)
  }
}
