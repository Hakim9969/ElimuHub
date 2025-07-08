import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {User} from '../../../../../models/user.model';
import {AuthService} from '../../../../services/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User | null>;
  private logoutSubscription!: Subscription;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.logoutSubscription = this.authService.logout$.subscribe(() => {
    });
  }

  ngOnDestroy() {
    this.logoutSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}
