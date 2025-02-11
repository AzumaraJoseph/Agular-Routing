
import { Component } from '@angular/core';

import { AuthService } from './user/auth.service';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { slideInAnimation } from './app.animation';
import { MessageService } from './messages/message.service';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ slideInAnimation ]
})
export class AppComponent {
  pageTitle = 'Acme Product Management';
  loading = true;

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return '';
  }

  get isMessageDisplayed(): boolean {
    return this.messageService.isDisplayed;
  }

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { 

    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });

  }
  // ngOnInit(): void {
  //   this.router.events.subscribe((routerEvent: Event) => {
  //     this.checkRouterEvent(routerEvent);
  //   });
  // }

  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/welcome'); // pass in string in navigatebyurl without te brackets
    console.log('Log out');
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    } 
    if ( routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }

  displayMessages(): void {
    //secondary routing in code(component)
    this.router.navigate([ {outlets: { popup: ['messages'] }}]);
    this.messageService.isDisplayed = true;
  }

  hideMessages(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
    this.messageService.isDisplayed = false;
  }
}
