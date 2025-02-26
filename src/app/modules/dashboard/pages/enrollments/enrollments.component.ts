import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EnrollmentActions } from './store/enrollment.actions';
import { generateRandomString } from '../../../../shared/utils';
import { forkJoin, Observable } from 'rxjs';
import { Enrollment } from './models';
import {
  selectEnrollments,
  selectEnrollmentsError,
  selectIsLoadingEnrollments,
} from './store/enrollment.selectors';
import { Course } from '../courses/models/courses.model';
import { User } from '../users/models/index';
import { CoursesService } from '../../../../core/services/courses.service';
import { UsersService } from '../../../../core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-enrollments',
  standalone: false,
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.scss'
})
export class EnrollmentsComponent implements OnInit, OnDestroy {
  enrollments$: Observable<Enrollment[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<unknown>;

  courses: Course[] = [];
  students: User[] = [];

  enrollmentForm: FormGroup;
coursename: any;

  constructor(
    private Store: Store,
    private CoursesService: CoursesService,
    private UsersService: UsersService,
    private fb: FormBuilder
  ) {
    this.enrollments$ = this.Store.select(selectEnrollments);
    this.error$ = this.Store.select(selectEnrollmentsError);
    this.isLoading$ = this.Store.select(selectIsLoadingEnrollments);
    this.enrollmentForm = this.fb.group({
      studentId: [null, Validators.required],
      courseId: [null, Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.Store.dispatch(EnrollmentActions.resetState());
  }
  ngOnInit(): void {
    this.Store.dispatch(EnrollmentActions.loadEnrollments());
    this.loadStudentsAndCourses();
  }

  loadStudentsAndCourses(): void {
    forkJoin([
      this.CoursesService.getCourses(),
      this.UsersService.getStudentUsers(),
    ]).subscribe({
      next: ([courses, students]) => {
        this.courses = courses;
        this.students = students;
      },
    });
  }

  createEnrollment(): void {
    if (this.enrollmentForm.valid) {
      const enrollmentData = this.enrollmentForm.value;
      this.Store.dispatch(
        EnrollmentActions.createEnrollment({
          data: enrollmentData
        })
      );
    } else {
      this.enrollmentForm.markAllAsTouched();
    }
  }
  

  onSubmit(): void {
    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched();
    } else {
      this.Store.dispatch(
        EnrollmentActions.createEnrollment({ data: this.enrollmentForm.value })
      );
    }
  }
}