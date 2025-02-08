import { Component, OnInit, signal } from '@angular/core';
import { StudentsService } from '../../../../../../core/services/students.service';
import { Student } from '../../models/student.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { generateRandomString } from '../../../../../../shared/utils';

@Component({
  selector: 'app-students-form',
  standalone: false,
  templateUrl: './students-form.component.html',
  styleUrl: './students-form.component.scss'
})
export class StudentsFormComponent implements OnInit {
  
  searchText: string = '';
  displayedColumns: string[] = ['id','name', 'lastname', 'age', 'email', 'country', 'address', 'course', 'actions'];
  dataSource: Student[] = [];
  students: any;
  filteredDataSource: Student[] | undefined;
  studentForm!: FormGroup;
  readonly panelOpenState = signal(false);

  
  constructor(
    private fb: FormBuilder, 
    private studentsService: StudentsService,
    private snackBar: MatSnackBar
  ) {
    this.studentForm = this.fb.group({
          id: [generateRandomString(6),Validators.required],
          name: ['', Validators.required],
          lastname: ['', Validators.required],
          age: ['', [Validators.required, Validators.min(1)]],
          email: ['', [Validators.required, Validators.email]],
          country: ['', Validators.required],
          address: ['', Validators.required],
          course: ['', Validators.required],
        });
   }

  // Función al enviar el formulario (agregar un estudiante)
  onSubmit(): void {
    if (this.studentForm.valid) {
      const newStudent: Student = { ...this.studentForm.value, isEditing: false };
      this.studentsService.addStudent(newStudent); // Agrega el estudiante al servicio
      this.openSnackBar('Alumno agregado exitosamente!', 'Cerrar');
      this.studentForm.reset(); // Resetea el formulario
    }
  }

  // Cargar los estudiantes desde localStorage
  ngOnInit(): void {
    this.dataSource = this.studentsService.getStudents(); 
  }

  enableEdit(index: number): void {
    this.dataSource[index].isEditing = true;
  }

  saveEdit(index: number): void {
    this.studentsService.updateStudent(index, this.dataSource[index]); // Actualizar en el servicio
    this.dataSource[index].isEditing = false;
    this.openSnackBar('Alumno actualizado exitosamente!', 'Cerrar');
  }

  cancelEdit(index: number): void {
    this.dataSource[index].isEditing = false;
    this.dataSource[index] = { ...this.studentsService.getStudent(index) }; // Restaurar los datos originales
  }

  deleteStudent(index: number): void {
    this.studentsService.deleteStudent(index); // Actualizar en el servicio (y localStorage)
    this.dataSource = this.studentsService.getStudents(); // Recargar la lista desde el servicio
    this.filteredDataSource = this.dataSource; // Actualiza el filtro
    this.openSnackBar('Alumno eliminado exitosamente!', 'Cerrar');
  }

  // Función para mostrar el mensaje del SnackBar
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000, // 3 segundos de duración
    });
  }

  // Método para aplicar el filtro de búsqueda
  applyFilter(): void {
    const filterValue = this.searchText.trim().toLowerCase();
    if (filterValue) {
      this.filteredDataSource = this.dataSource.filter((student) =>
        student.name.toLowerCase().includes(filterValue) ||
        student.lastname.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredDataSource = this.dataSource; // Si no hay filtro, muestra todos los estudiantes
    }
  }
}