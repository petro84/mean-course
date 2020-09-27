import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuthenticated = false;
  private authSub: Subscription;

  constructor(private aService: AuthService) {}

  ngOnInit(): void {
    this.userAuthenticated = this.aService.getIsAuth();
    this.authSub = this.aService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.aService.logout();
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
