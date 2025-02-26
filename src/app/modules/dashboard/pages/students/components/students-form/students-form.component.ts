import { Component, OnInit, signal } from '@angular/core';
import { StudentsService } from '../../../../../../core/services/students.service';
import { Student } from '../../models/student.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { generateRandomString } from '../../../../../../shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { StudentDialogFormComponent } from '../student-dialog-form/student-dialog-form.component';

@Component({
  selector: 'app-students-form',
  standalone: false,
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss'],
})
export class StudentsFormComponent implements OnInit {
  panelOpenState = signal(false); 
  searchText: string = '';
  displayedColumns: string[] = ['id', 'name', 'lastname', 'age', 'email', 'country', 'address', 'course', 'actions'];
  dataSource: Student[] = [];
  filteredDataSource: Student[] | undefined;
  studentForm!: FormGroup;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private studentsService: StudentsService,
    private snackBar: MatSnackBar
  ) {
    this.studentForm = this.fb.group({
      id: [generateRandomString(6), Validators.required],
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
      this.studentsService.addStudent(newStudent).subscribe({
        next: () => {
          this.openSnackBar('Alumno agregado exitosamente!', 'Cerrar');
          this.studentForm.reset(); // Resetea el formulario
          this.loadStudents(); // Recargar la lista de estudiantes
        },
        error: (err) => {
          this.openSnackBar('Error al agregar el alumno', 'Cerrar');
          console.error('Error al agregar alumno', err);
        },
      });
    }
  }

  // Cargar los estudiantes desde la API
  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentsService.getStudents().subscribe({
      next: (students) => {
        this.dataSource = students;
        this.filteredDataSource = students; // Establece el filtro inicial
      },
      error: (err) => {
        console.error('Error al cargar estudiantes', err);
        this.openSnackBar('Error al cargar estudiantes', 'Cerrar');
      },
    });
  }

  enableEdit(index: number): void {
    this.dataSource[index].isEditing = true;
  }

  saveEdit(index: number): void {
    const updatedStudent = this.dataSource[index];
  
    // Verificar que el ID no es undefined
    if (updatedStudent.id) {
      this.studentsService.updateStudent(updatedStudent.id, updatedStudent).subscribe({
        next: () => {
          this.dataSource[index].isEditing = false;
          this.openSnackBar('Alumno actualizado exitosamente!', 'Cerrar');
        },
        error: (err) => {
          this.openSnackBar('Error al actualizar el alumno', 'Cerrar');
          console.error('Error al actualizar alumno', err);
        },
      });
    } else {
      this.openSnackBar('ID de alumno no encontrado', 'Cerrar');
      console.error('ID de alumno no encontrado');
    }
  }
  

  cancelEdit(index: number): void {
    this.dataSource[index].isEditing = false;
    this.loadStudents(); // Restaurar los datos originales desde la API
  }

  deleteStudent(index: number): void {
    const studentId = this.dataSource[index].id;
    
    // Verificar que el ID no es undefined
    if (studentId) {
      this.studentsService.deleteStudent(studentId).subscribe({
        next: () => {
          this.dataSource.splice(index, 1); // Eliminar de la lista local
          this.filteredDataSource = [...this.dataSource]; // Actualizar el filtro
          this.openSnackBar('Alumno eliminado exitosamente!', 'Cerrar');
        },
        error: (err) => {
          this.openSnackBar('Error al eliminar el alumno', 'Cerrar');
          console.error('Error al eliminar alumno', err);
        },
      });
    } else {
      this.openSnackBar('ID de alumno no encontrado', 'Cerrar');
      console.error('ID de alumno no encontrado');
    }
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

  // Función para ver los detalles del estudiante
  viewDetails(student: Student): void {
    const dialogRef = this.dialog.open(StudentDialogFormComponent, {
      width: '400px',
      data: student,
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Detalles del estudiante cerrados');
    });
  }
}
