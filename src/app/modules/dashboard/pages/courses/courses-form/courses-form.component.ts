import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../../../../../core/services/courses.service'; // Asumiendo que tienes un servicio para manejar los cursos
import { generateRandomString } from '../../../../../shared/utils';
import { Course } from '../models/courses.model';

@Component({
  selector: 'app-courses-form',
  standalone: false,
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss']
})
export class CoursesFormComponent implements OnInit {

  searchText: string = '';
  displayedColumns: string[] = ['id', 'courseName', 'description', 'duration', 'teacher', 'actions'];
  dataSource: Course[] = [];
  filteredDataSource: Course[] | undefined;
  courseForm!: FormGroup; // Formulario para agregar o editar cursos
  readonly panelOpenState = signal(false);

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService, // Suponiendo que tienes un servicio de cursos
    private snackBar: MatSnackBar
  ) {
    this.courseForm = this.fb.group({
      id: [generateRandomString(6), Validators.required], // Se podría generar un id único
      courseName: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      teacher: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.dataSource = this.coursesService.getCourses(); // Cargar los cursos desde el servicio
  }

  // Función para agregar un nuevo curso
  onSubmit(): void {
    if (this.courseForm.valid) {
      const newCourse: Course = { ...this.courseForm.value, isEditing: false };
      this.coursesService.addCourse(newCourse); // Agregar el curso al servicio
      this.openSnackBar('Curso agregado exitosamente!', 'Cerrar');
      this.courseForm.reset(); // Resetea el formulario
    }
  }

  // Método para habilitar la edición del curso
  enableEdit(index: number): void {
    this.dataSource[index].isEditing = true;
  }

  // Método para guardar los cambios después de la edición
  saveEdit(index: number): void {
    this.coursesService.updateCourse(index, this.dataSource[index]); // Actualizar en el servicio
    this.dataSource[index].isEditing = false;
    this.openSnackBar('Curso actualizado exitosamente!', 'Cerrar');
  }

  // Cancelar la edición y restaurar los valores originales
  cancelEdit(index: number): void {
    this.dataSource[index].isEditing = false;
    this.dataSource[index] = { ...this.coursesService.getCourse(index) }; // Restaurar los datos originales
  }

  // Eliminar un curso
  deleteCourse(index: number): void {
    this.coursesService.deleteCourse(index); // Actualizar en el servicio (y localStorage)
    this.dataSource = this.coursesService.getCourses(); // Recargar la lista desde el servicio
    this.filteredDataSource = this.dataSource; // Actualiza el filtro
    this.openSnackBar('Curso eliminado exitosamente!', 'Cerrar');
  }

  // Mostrar el mensaje del SnackBar
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000, // 3 segundos de duración
    });
  }

  // Aplicar el filtro de búsqueda
  applyFilter(): void {
    const filterValue = this.searchText.trim().toLowerCase();
    if (filterValue) {
      this.filteredDataSource = this.dataSource.filter((course) =>
        course.courseName.toLowerCase().includes(filterValue) ||
        course.teacher.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredDataSource = this.dataSource; // Si no hay filtro, muestra todos los cursos
    }
  }
}
