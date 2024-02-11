import { Component } from '@angular/core';
import {photoUrl} from "../../configs/urls";
import {catchError, Observable, tap} from "rxjs";
import {UserService} from "../../services/user/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent {

    protected readonly imagePath = photoUrl;


  isInputFocused: boolean = false

  searchValue!: string;

  searchUsers:any

  handleBlur() {
    setTimeout(() => {
      this.isInputFocused = false;
    }, 200);  // Задержка в 200 миллисекунд
  }

  constructor( private userService:UserService,private route:Router) {
  }

  fetchMyData(serviceMethod: () => Observable<any>, propertyToUpdate: any) {
    serviceMethod()
      .pipe(
        tap((response: any) => {
          (this as any)[propertyToUpdate] = response;
        }),
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return [];
        })
      )
      .subscribe();
  }

  search() {
    this.fetchMyData(() => this.userService.getAll(this.searchValue), 'searchUsers');
  }

  visitUser(id: number) {
    this.route.navigateByUrl('/visit/' + id)
  }



}
