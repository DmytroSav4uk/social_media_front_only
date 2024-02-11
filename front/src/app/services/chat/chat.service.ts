import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {urls} from "../../configs/urls";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient) { }

  getAllRooms(): Observable<any> {
    return this.httpClient.get<any>(urls.chat.all)
  }

  getAllGroupRooms(): Observable<any> {
    return this.httpClient.get<any>(urls.chat.allGroupChats)
  }

  viewRoom(id: number): Observable<any> {
    return this.httpClient.get<any>(urls.chat.view + "/" + id)
  }

  viewGroupRoom(id: number): Observable<any> {
    return this.httpClient.get<any>(urls.chat.viewGroupChat + "/" + id)
  }

  updateRoom(id: number): Observable<any> {
    return this.httpClient.get<any>(urls.chat.update + "/" + id)
  }

  updateGroup(id: number): Observable<any> {
    return this.httpClient.get<any>(urls.chat.updateGroup + "/" + id)
  }

  createNewRoom(id: number): Observable<any> {
    const currentUser = localStorage.getItem('currentUser');
    return this.httpClient.post<any>(urls.chat.createNewRoom + "/" + id, currentUser)
  }

  sendMessage(roomId: number, message: object): Observable<any> {
    return this.httpClient.post <any>(urls.chat.sendMessage + "/" + roomId, message)
  }


  sendMessageToGroupChat(roomId: number, message: object): Observable<any> {
    return this.httpClient.post <any>(urls.chat.sendMessageToParty + "/" + roomId, message)
  }

  editMessage(messageId: number, message: object): Observable<any> {
    return this.httpClient.post <any>(urls.chat.editMessage + "/" + messageId, message)
  }

  deleteForMe(messageId: number):Observable<any>{
    return  this.httpClient.delete<any>(urls.chat.deleteForMe + "/" + messageId)
  }

  deleteForAll(messageId: number):Observable<any>{
    return  this.httpClient.delete<any>(urls.chat.deleteForAll + "/" + messageId)
  }

  photoUpload(roomId:number,photoFile:any):Observable<any>{
    return this.httpClient.post<any>(urls.chat.upload + "/" + roomId , photoFile)
  }

  photoUploadParty(roomId:number,photoFile:any):Observable<any>{
    return this.httpClient.post<any>(urls.chat.uploadParty + "/" + roomId , photoFile)
  }

  audioUpload(id:number,audioFile:any):Observable<any>{
    return this.httpClient.post<any>(urls.chat.uploadAudio + "/" + id , audioFile)
  }
}
