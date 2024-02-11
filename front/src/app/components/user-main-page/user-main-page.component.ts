import {Component,  OnInit} from '@angular/core';
import {photoUrl} from "../../configs/urls";
import {FriendsService} from "../../services/friends/friends.service";
import {catchError, Observable, tap} from "rxjs";
import {ProfileService} from "../../services/profile/profile.service";
import {PublicationsService} from "../../services/publications/publications.service";
import {OwlOptions} from "ngx-owl-carousel-o";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {UserService} from "../../services/user/user.service";
import {Router} from "@angular/router";
import {LivechatService} from "../../services/livechat/livechat.service";


@Component({
  selector: 'app-user-main-page',
  templateUrl: './user-main-page.component.html',
  styleUrls: ['./user-main-page.component.css'],
  animations: [
    trigger('slideDownAnimation', [
      state('void', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('*', style({
        height: '*',
        overflow: 'hidden'
      })),
      transition('void <=> *', animate('500ms ease-in'))
    ])
  ]
})
export class UserMainPageComponent implements OnInit {

  constructor( private webSocketService: LivechatService,private route:Router,private userService:UserService,private formBuilder: FormBuilder, private friendsService: FriendsService, private profileService: ProfileService, private publicationsService: PublicationsService) {
  }


  postForm!: FormGroup

  commentForm!:FormGroup

  user: any;

  friends: any;

  publications: any;


  isInputFocused: boolean = false

  showFriends: boolean = false

  showMain: boolean = false

  showPhotos: boolean = false

  imagePath = photoUrl

  token!:string;

  ngOnInit() {
    this.fetchMyData(() => this.profileService.getMyProfile(), 'user');
    this.fetchMyData(() => this.publicationsService.getMyPublications(), 'publications');

    const currentUser = localStorage.getItem('currentUser');
    const token = currentUser ? (JSON.parse(currentUser)?.access_token || null) : null;
    this.token = token

    this.webSocketService.connect(`ws://44.201.133.98:3030/livechat/socket?token=${this.token}`);

    this.createPostForm()
    this.createCommentForm()
    this.showMain = true;
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

  like(id: number) {
    this.publicationsService.like(id).pipe(
      tap((response: any) => {
        this.fetchMyData(() => this.publicationsService.getMyPublications(), 'publications');
      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return [];
      })
    )
      .subscribe();
  }


  getPhotos() {

  }

  getMain() {
    this.showFriends = false
    this.showMain = true
    this.showPhotos = false
  }


  customOptions: OwlOptions = {
    loop: false,
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

  pendingFormData!: FormData;

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      this.pendingFormData = new FormData();
      for (let i = 0; i < input.files.length; i++) {
        this.pendingFormData.append('files', input.files[i], input.files[i].name);
      }
    }
  }



  submit() {
    if (!this.pendingFormData) {
      this.pendingFormData = new FormData();
    }

    this.pendingFormData.append('text', this.postForm.get('text')?.value);

    this.publicationsService.postPublication(this.pendingFormData).pipe(
      tap((response: any) => {
        this.postForm.reset();
        this.pendingFormData = new FormData();  // Reset the pendingFormData as well
        this.fetchMyData(() => this.publicationsService.getMyPublications(), 'publications');
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
          this.fetchMyData(() => this.publicationsService.getMyPublications(), 'publications');
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

  goToEdit() {
    this.route.navigateByUrl('/edit')
  }

  deletePublication(id:number) {
    this.fetchMyData(() => this.publicationsService.deletePublication(id), '');
    setTimeout(()=>{
      this.fetchMyData(() => this.publicationsService.getMyPublications(), 'publications');
    },1000)
  }
}
