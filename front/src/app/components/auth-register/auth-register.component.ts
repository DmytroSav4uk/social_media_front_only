import {ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthRegService} from "../../services/auth/auth-reg.service";
import {catchError, Observable, tap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.css']
})
export class AuthRegisterComponent implements OnInit {

  @ViewChild('container', {static: true}) container!: ElementRef;

  loginForm: FormGroup = new FormGroup({});
  registerForm: FormGroup = new FormGroup({});

  success: boolean = false

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private authRegService: AuthRegService,
    private router: Router
  ) {
    this
      .loginForm = new FormGroup({});
    this
      .registerForm = new FormGroup({});
  }

  onSignUpClick(): void {
    this.container.nativeElement.classList.add("right-panel-active");
  }

  onSignInClick(): void {
    this.container.nativeElement.classList.remove("right-panel-active");
  }

  ngOnInit(): void {

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])/;

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(passwordRegex)]]
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  getPasswordError(): string {
    const password = this.registerForm?.get('password')?.value;
    let errorMessages: string[] = [];
    if (!/(?=.*[@!?<>#$%^&+=])/.test(password)) {
      errorMessages.push('Missing special symbol.');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errorMessages.push('Missing uppercase letter.');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errorMessages.push('Missing lowercase letter.');
    }
    if (!/(?=.*[0-9])/.test(password)) {
      errorMessages.push('Missing number.');
    }
    return errorMessages.join(' ');
  }

  submitRegisterForm() {
    this.authRegService.register(this.registerForm.value)
      .pipe(
        tap((response: any) => {
          this.registerForm.reset();
          localStorage.setItem("currentUser", JSON.stringify(response))
          this.success = true
          setTimeout(()=>{
            this.router.navigateByUrl('/main');
          },1000)
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
      .subscribe();
  }

  submitLoginForm() {

    this.authRegService.auth(this.loginForm.value)
      .pipe(
        tap((response: any) => {
          this.loginForm.reset()
          localStorage.setItem("currentUser", JSON.stringify(response))
          this.router.navigateByUrl('/main');
        }),
        catchError((error: any): Observable<any> => {
          throw error;
        })
      )
      .subscribe();
  }
  signInPhone:boolean = true;
  signUpPhone!:boolean;

  showSignIn() {
    this.signInPhone = true
    this.signUpPhone = false
  }

  showSignUp() {
    this.signInPhone = false
    this.signUpPhone = true
  }
}
