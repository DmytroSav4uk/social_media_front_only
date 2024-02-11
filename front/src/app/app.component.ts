import {Component, OnInit} from '@angular/core';

import {RouterService} from "./services/router/router.service";
import {NavigationEnd, Router} from '@angular/router';
import {filter} from "rxjs/operators";
import {photoUrl} from "./configs/urls";
import {catchError, Observable, tap} from "rxjs";
import {FriendsService} from "./services/friends/friends.service";
import {ProfileService} from "./services/profile/profile.service";
import {FriendfilterPipe} from "./pipes/friendfilter.pipe";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FriendfilterPipe]
})
export class AppComponent implements OnInit {


  constructor(private friendFilterPipe: FriendfilterPipe, public router: RouterService, private route: Router, private friendsService: FriendsService, private profileService: ProfileService) {
  }

  title = 'social_media'

  ngOnInit() {
    this.route.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url !== '/' && event.url !== '') {
          this.getMyProfile()
          this.getFriends();
          this.getPending()
        }
      });
  }

  imagePath = photoUrl


  getMyProfile() {
    this.profileService.getMyProfile()
      .pipe(
        tap((response: any) => {
          this.user = response
        }),
        catchError((error: any): Observable<any> => {
          throw error
        })
      )
      .subscribe();
  }

  getFriends() {
    this.friendsService.getMyFriends()
      .pipe(
        tap((response: any) => {
          this.friends = response
        }),
        catchError((error: any): Observable<any> => {
          throw error
        })
      )
      .subscribe();
  }

  getPending() {
    this.friendsService.getPending()
      .pipe(
        tap((response: any) => {
          this.pending = response

        }),
        catchError((error: any): Observable<any> => {
          throw error
        })
      )
      .subscribe();
  }


  user: any
  friends: any
  pending: any
  leftSide = false;
  rightSide = false;
  searchText: string = '';

  get filteredFriends() {

    console.log('All friends:', this.friends);
    if (Array.isArray(this.friends?.users)) {
      const filtered = this.friendFilterPipe.transform(this.friends.users, this.searchText);
      console.log('Filtered friends in getter:', filtered);
      return filtered;
    }
    return [];

  }

  toggleLeftSide(): void {
    this.leftSide = !this.leftSide;
  }

  toggleRightSide(): void {
    this.rightSide = !this.rightSide;
  }

  closeSides(): void {
    this.rightSide = false;
    this.leftSide = false;
  }

  visitUser(id: number) {
    this.route.navigateByUrl('/visit/' + id)
  }

  navigateToMain() {
    this.route.navigateByUrl('/main')
  }

  navigateToChat() {
    this.route.navigateByUrl('/chat')
  }

  acceptFriend(id: number) {
    this.friendsService.accept(id)
      .pipe(
        tap((response: any) => {
          this.getPending()
          this.getFriends()
        }),
        catchError((error: any): Observable<any> => {
          throw error
        })
      )
      .subscribe();
  }

  denyFriend(id: number) {
    this.friendsService.deny(id)
      .pipe(
        tap((response: any) => {
          this.getPending()
          this.getFriends()
        }),
        catchError((error: any): Observable<any> => {
          throw error
        })
      )
      .subscribe();
  }
}
