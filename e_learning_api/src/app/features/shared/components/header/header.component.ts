import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
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
  private userSubscription?: Subscription;
  private logoutSubscription!: Subscription;
  userName: string | null = null;
  showLogoutModal = false;


  constructor(private authService: AuthService,  private router: Router,
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.userName = user?.name ? user.name.split(' ')[0] : null;
    });
  }

  ngOnInit() {
    this.logoutSubscription = this.authService.logout$.subscribe(() => {
    });
  }

  ngOnDestroy() {
    this.logoutSubscription.unsubscribe();
  }

  logout() {
    this.showLogoutModal = true;
    setTimeout(() => {
      this.authService.logout();
      this.showLogoutModal = false;
      this.router.navigate(['/']);
    }, 1500)
  }
}
