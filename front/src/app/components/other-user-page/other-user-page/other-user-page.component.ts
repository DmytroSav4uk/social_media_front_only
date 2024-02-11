import {Component, OnInit} from '@angular/core';
import {FriendsService} from "../../../services/friends/friends.service";
import {photoUrl} from "../../../configs/urls";
import {catchError, Observable, tap} from "rxjs";
import {ProfileService} from "../../../services/profile/profile.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PublicationsService} from "../../../services/publications/publications.service";
import {OwlOptions} from "ngx-owl-carousel-o";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatService} from "../../../services/chat/chat.service";

@Component({
  selector: 'app-other-user-page',
  templateUrl: './other-user-page.component.html',
  styleUrls: ['./other-user-page.component.css']
})
export class OtherUserPageComponent implements OnInit{
  constructor(private chatService:ChatService,private router: Router,private formBuilder: FormBuilder,private publicationsService:PublicationsService,private friendsService: FriendsService,private profileService:ProfileService,private route: ActivatedRoute) {
  }

  postForm!: FormGroup

  commentForm!:FormGroup

  user: any;

  publications:any

  friends: any;



  showFriends:boolean = false

  showMain:boolean = false

  showPhotos:boolean = false

  imagePath = photoUrl

  id:any;

  ngOnInit() {

    this.route.params.subscribe(params => {
     this.id = params['id'];
      this.fetchMyData(()=> this.profileService.getProfileById(this.id), 'user');
      this.fetchMyData(()=> this.publicationsService.getPublicationsByUserId(this.id), 'publications');
      this.createPostForm()
      this.createCommentForm()
      this.showMain = true;
      });


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





  getMain() {
    this.showFriends = false
    this.showMain = true
    this.showPhotos = false
  }



  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,

    dots: true,
    navSpeed: 700,
    navText: ['<', '>'],

    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

  private createPostForm() {
    this.postForm = this.formBuilder.group({
      text: ['', Validators.required],
      files: [[]]
    });
  }

  submit() {
    this.publicationsService.postPublication(this.postForm.value).pipe(
      tap((response: any) => {
        this.postForm.reset()
        this.fetchMyData(()=> this.publicationsService.getPublicationsByUserId(this.id), 'publications');

      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return [];
      })
    )
      .subscribe();
  }


  commentSubmit(id:number){

    this.publicationsService.comment(id,this.commentForm.value).pipe(
      tap((response: any) => {
        this.commentForm.reset()
        this.showComments(id)
        this.fetchMyData(()=> this.publicationsService.getPublicationsByUserId(this.id), 'publications');

      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return [];
      })
    )
      .subscribe();

  }

  comments: any
  showCommentId:any

  showComments(id: number) {
    this.publicationsService.getPublicationById(id)
      .pipe(
        tap((response: any) => {
          this.comments = response.publicationComments
          this.showCommentId = id
        }),
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return [];
        })
      )
      .subscribe();

  }


  private createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required],
    });
  }


  getPhotos(){

  }

  like(id: number) {
    this.publicationsService.like(id).pipe(
      tap((response: any) => {
        this.fetchMyData(()=> this.publicationsService.getPublicationsByUserId(this.id), 'publications');
      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return [];
      })
    )
      .subscribe();
  }


  becomeFriends() {
    this.fetchMyData(()=> this.friendsService.sendFriendRequest(this.id), '');
  }

  goToMessage() {
    this.chatService.createNewRoom(this.id).pipe(
      tap((response: any) => {
        this.router.navigateByUrl('/message/' + response.id)
      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return [];
      })
    )
      .subscribe();
  }
}


