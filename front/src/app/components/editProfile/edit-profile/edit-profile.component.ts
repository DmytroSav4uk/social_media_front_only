import {Component, OnInit} from '@angular/core';
import {photoUrl} from "../../../configs/urls";
import {catchError, Observable, of, tap} from "rxjs";
import {ProfileService} from "../../../services/profile/profile.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  userProfile: any

  profileForm!: FormGroup;


  constructor(private formBuilder: FormBuilder, private profileService: ProfileService) {
  }

  ngOnInit() {
    this.createProfileForm()
    this.fetchMyData(() => this.profileService.getMyProfile(), 'userProfile', false, true);


  }


  createProfileForm() {
    this.profileForm = this.formBuilder.group({
      name: [''],
      surname: [''],
      nickname: [''],
      phone: ['', [Validators.pattern('^[0-9]+-*$')]],
      userJob: [''],
      userCity: ['']
    });
  }


  updateProfileForm() {
    this.profileForm.patchValue({
      name: this.userProfile?.name || '',
      surname: this.userProfile?.surname || '',
      nickname: this.userProfile?.nickname || '',
      phone: this.userProfile?.phone || '',
      userJob: this.userProfile?.userJob || '',
      userCity: this.userProfile?.userCity || ''
    });



  }


  fetchMyData(serviceMethod: () => Observable<any>, propertyToUpdate: any, reload: boolean, patch: any, whatToReload?: () => void) {
    serviceMethod()
      .pipe(
        tap((response: any) => {
          if (propertyToUpdate) {
            (this as any)[propertyToUpdate] = response;
          }
          if (reload && typeof whatToReload === 'function') {
            whatToReload();
          }
          if (patch) {
            this.updateProfileForm()
          }

        }),
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return of([]); // use 'of' to return an observable
        })
      )
      .subscribe();
  }


  imagePath = photoUrl


  submit() {
    this.fetchMyData(
      () => this.profileService.change(this.profileForm.value),
      '',
      true,
      () =>
        this.fetchMyData(() => this.profileService.getMyProfile(), 'userProfile', true, false)
    );

setTimeout(()=>{   window.location.reload();},1000)



  }


  selectedImage!: File;

  onFileSelected(event: any, whereTo:string) {
    this.selectedImage = <File>event.target.files[0];

    if (whereTo === 'profile'){
      this.uploadImage()
    }else if(whereTo === "back"){
      this.uploadBackImage()
    }
  }

  private uploadImage() {
    const fd = new FormData();
    fd.append('file', this.selectedImage, this.selectedImage.name)

    this.profileService.photoUpload(fd)
      .pipe(
        tap((response: any) => {
          this.fetchMyData(() => this.profileService.getMyProfile(), 'userProfile', false, true);
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
      .subscribe();
  }

  private uploadBackImage() {
    const fd = new FormData();
    fd.append('file', this.selectedImage, this.selectedImage.name)

    this.profileService.backPhotoUpload(fd)
      .pipe(
        tap((response: any) => {
          this.fetchMyData(() => this.profileService.getMyProfile(), 'userProfile', false, true);
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
      .subscribe();
  }

}
