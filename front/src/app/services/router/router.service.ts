import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  currentUrl!: string;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event as NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  isRestrictedRoute(): boolean {
    const restrictedRoutes = ['/'];
    return restrictedRoutes.includes(this.currentUrl);
  }




}
