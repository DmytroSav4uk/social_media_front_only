import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {catchError, Observable,  throwError} from "rxjs";
import {urls} from "../../configs/urls";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LivechatService {



  constructor(private httpClient:HttpClient) {
  }

  private socket$!: WebSocketSubject<any>;


  public connect(url:string): void {
    this.socket$ = webSocket(url)

    this.socket$.pipe(
      catchError((error: any) => {
        console.log('Error:', error);
        return throwError(error);
      })
    ).subscribe();

  }

  public sendMessage(message: any): void{
    this.socket$.next(message);
  }

  public onMessage(): Observable<any>{
    return this.socket$.asObservable();
  }

  public disconnect():void{
    this.socket$.complete();
  }

  getMessages(): Observable<any> {
    return this.httpClient.get<any>(urls.liveChat.live)
  }



}
