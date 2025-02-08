import { Injectable } from '@angular/core';
import { Course } from '../../modules/dashboard/pages/courses/models/courses.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private courses: Course[] = [];

  constructor() {
    // Cargar los cursos desde el almacenamiento local (si es necesario)
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      this.courses = JSON.parse(storedCourses);
    }
  }

  getCourses(): Course[] {
    return this.courses;
  }

  getCourse(index: number): Course {
    return this.courses[index];
  }

  addCourse(course: Course): void {
    this.courses.push(course);
    this.saveCourses();
  }

  updateCourse(index: number, updatedCourse: Course): void {
    this.courses[index] = updatedCourse;
    this.saveCourses();
  }

  deleteCourse(index: number): void {
    this.courses.splice(index, 1);
    this.saveCourses();
  }

  private saveCourses(): void {
    localStorage.setItem('courses', JSON.stringify(this.courses));
  }
}
