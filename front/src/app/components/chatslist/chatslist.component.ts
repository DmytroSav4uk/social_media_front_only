import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat/chat.service";
import {catchError, Observable, tap} from "rxjs";
import {photoUrl} from "../../configs/urls";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chatslist',
  templateUrl: './chatslist.component.html',
  styleUrls: ['./chatslist.component.css']
})
export class ChatslistComponent implements OnInit {

  rooms: any;
  email: any;

  imagePath = photoUrl

  constructor(private route: Router, private chatService: ChatService) {
  }

  ngOnInit() {
    this.getCurrentUserEmail()
    this.getChats()
  }

  getCurrentUserEmail() {
    const currentUser = localStorage.getItem('currentUser');
    const email = currentUser ? (JSON.parse(currentUser)?.email || null) : null;
    this.email = email
  }

  getChats() {
    this.chatService.getAllRooms()
      .pipe(
        tap((response: any) => {
          this.rooms = response
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
      .subscribe();
  }


  countUnread(room: any) {
    let count = 0;
    for (const message of room.messages) {
      if (!message.read) {
        count += 1
      }
    }
    return count
  }


  chatWithUser(id: number) {
    this.route.navigateByUrl('/message/' + id)
  }
}
