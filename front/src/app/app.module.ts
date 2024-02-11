import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule, NgIf} from '@angular/common';

import {AppComponent} from './app.component';
import {RouterModule, RouterOutlet, Routes} from "@angular/router";

import {AuthRegisterComponent} from './components/auth-register/auth-register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserMainPageComponent} from './components/user-main-page/user-main-page.component';
import {TokenInterceptor} from "./services/interceptor/token.interceptor";
import { OtherUserPageComponent } from './components/other-user-page/other-user-page/other-user-page.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { EditProfileComponent } from './components/editProfile/edit-profile/edit-profile.component';
import { PrivateChatComponent } from './components/private-chat/private-chat.component';
import { ChatslistComponent } from './components/chatslist/chatslist.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { FriendfilterPipe } from './pipes/friendfilter.pipe';
import { UserSearchComponent } from './components/user-search/user-search.component';


const routes: Routes = [
  {path: '', component: AuthRegisterComponent},
  {path: 'main', component: UserMainPageComponent},
  {path:'edit',component:EditProfileComponent},
  {path:'visit/:id',component:OtherUserPageComponent},
  {path:'message/:id',component:PrivateChatComponent},
  {path:'chatslist',component:ChatslistComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    AuthRegisterComponent,
    UserMainPageComponent,
    OtherUserPageComponent,
    EditProfileComponent,
    PrivateChatComponent,
    ChatslistComponent,
    TimeAgoPipe,
    FriendfilterPipe,
    UserSearchComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    RouterOutlet,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    CarouselModule,
    BrowserAnimationsModule
  ],
  exports: [
    FormsModule,
    NgIf, CommonModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
