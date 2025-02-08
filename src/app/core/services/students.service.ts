import { Injectable } from '@angular/core';
import { Student } from '../../modules/dashboard/pages/students/models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private localStorageKey = 'students';

  constructor() {
    // Inicializa el localStorage si no hay datos
    const studentsFromStorage = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    if (!studentsFromStorage.length) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
    }
  }

  // Generar un id aleatorio
  generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getStudents(): Student[] {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  getStudent(index: number): Student {
    const students = this.getStudents();
    return students[index];
  }

  addStudent(student: Student): void {
    // Asignar un id único al estudiante
    student.id = this.generateRandomString();
    const students = this.getStudents();
    students.push(student);
    this.saveStudents(students);
  }

  updateStudent(index: number, updatedStudent: Student): void {
    const students = this.getStudents();
    students[index] = updatedStudent;
    this.saveStudents(students);
  }

  deleteStudent(index: number): void {
    const students = this.getStudents();
    students.splice(index, 1);
    this.saveStudents(students);
  }

  private saveStudents(students: Student[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(students));
  }
}