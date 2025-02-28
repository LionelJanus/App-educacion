import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../../core/services/user.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from './models';
import { selectUsers } from './store/user.selectors';
import { AuthService } from '../../../../core/services/authservice'; 
import { generateRandomString } from '../../../../shared/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  users$: Observable<User[]>;
  newUser: Partial<User> = { name: '', email: '', role: 'STUDENT', password: '' };
  displayedColumns: string[] = ['name', 'email', 'role', 'actions']; // Definición de las columnas

  constructor(
    public authService: AuthService,
    private usersService: UsersService,
    private store: Store
  ) {
    this.users$ = this.store.select(selectUsers);
  }

  ngOnDestroy(): void {
    this.usersService.resetUserState();
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }


  deleteUserById(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(id).subscribe(() => {
          this.users = this.users.filter(user => user.id !== id);
          Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
        });
      }
    });
  }

  createUser(): void {
    const newUserWithIdAndToken: User = {
      ...this.newUser,
      id: generateRandomString(6), 
      accessToken: generateRandomString(32)
    } as User;

    this.authService.createUser(newUserWithIdAndToken);
    this.resetNewUserForm();
  }

  resetNewUserForm(): void {
    this.newUser = { name: '', email: '', role: 'STUDENT', password: '' };
  }
}
