import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../../core/services/user.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from './models';
import { selectUsers } from './store/user.selectors';



@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;

  constructor(private usersService: UsersService, private store: Store) {
    this.users$ = this.store.select(selectUsers);
  }
  ngOnDestroy(): void {
    this.usersService.resetUserState();
  }

  ngOnInit(): void {
    this.usersService.loadUsers();
  }

  deleteUserById(id: string) {
    this.usersService.deleteUserById(id);
  }
}