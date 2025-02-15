import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/authservice';
import { Observable } from 'rxjs';
import { User } from '../../pages/users/models/index';

@Component({
  selector: 'app-toolbar',
  standalone:false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  authUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.authUser$ = this.authService.authUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
