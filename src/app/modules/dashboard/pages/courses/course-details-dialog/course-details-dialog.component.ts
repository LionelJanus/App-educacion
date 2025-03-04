import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../models/courses.model';
import { forkJoin, Observable } from 'rxjs';
import { UsersService } from '../../../../../core/services/user.service';

@Component({
  selector: 'app-course-details-dialog',
  standalone: false,
  templateUrl: './course-details-dialog.component.html',
  styleUrl: './course-details-dialog.component.scss'
})
export class CourseDetailsDialogComponent {
  enrolledUserDetails$: Observable<any[]>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Course, private usersService: UsersService) {
    // Verificar si enrolledUsers está definido antes de mapear
    if (data.enrolledUsers && data.enrolledUsers.length > 0) {
      this.enrolledUserDetails$ = forkJoin(
        data.enrolledUsers.map(userId => this.usersService.getUserById(userId))
      );
    } else {
      this.enrolledUserDetails$ = new Observable();  // Si no hay usuarios inscritos
    }
  }
}