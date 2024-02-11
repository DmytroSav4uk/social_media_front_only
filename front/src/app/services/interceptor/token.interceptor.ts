import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthRegService} from "../auth/auth-reg.service";
import {Router} from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authRegService: AuthRegService, private router: Router) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const currentUser = localStorage.getItem('currentUser');
    const token = currentUser ? (JSON.parse(currentUser)?.access_token || null) : null;
    const refresh = currentUser ? (JSON.parse(currentUser)?.refresh_token || null) : null;

    if (req.url.includes('signin') || (req.url.includes('signup'))) {
      return next.handle(req);
    }

    if (this.isTokenExpired(refresh)) {
      localStorage.removeItem('currentUser');
      this.router.navigateByUrl('/auth');
    }

    if (token && !this.isTokenExpired(token)) {
      const modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(modifiedReq);
    } else {
      console.log('token refresh try')
      return this.refreshTokenAndRetry(req, next);
    }
  }

  isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate < new Date();
  }


  getTokenExpirationDate(token: string): Date {
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);


    if (decodedToken && decodedToken.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      return expirationDate;
    }
    return new Date(0);
  }

  refreshTokenAndRetry(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const currentUser = localStorage.getItem('currentUser');
    const refreshToken = currentUser ? (JSON.parse(currentUser)?.refresh_token || null) : null;

    let data = {
      token: refreshToken
    }

    return this.authRegService.refreshToken(data).pipe(
      switchMap((response: any) => {

        const newAccessToken = response?.access_token;

        localStorage.setItem('currentUser', JSON.stringify(response));
        const modifiedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        return next.handle(modifiedReq);
      }),
      catchError((error) => {
         localStorage.removeItem('currentUser');
        this.router.navigateByUrl('/auth');
        return throwError('Authorization token not found');
      })
    );
  }
}
