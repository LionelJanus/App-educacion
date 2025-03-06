import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../../../core/services/students.service'; // Ajusta la ruta a tu archivo
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-students',
  standalone:false,
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  studentId: string='';
  studentCourses: any[] = [];

  constructor(
    private studentsService: StudentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID del estudiante desde la URL
    this.studentId = this.route.snapshot.paramMap.get('id')!;
    
    // Obtener los cursos del estudiante (o todos los cursos)
    this.studentsService.getCourses().subscribe(
      (courses) => {
        this.studentCourses = courses;
      },
      (error) => {
        console.error('Error al obtener los cursos del estudiante', error);
      }
    );
  }

   // Ver presentismo del curso
   viewAttendance(course: any) {
    Swal.fire({
      title: `Presentismo - ${course.courseName}`,
      text: 'Aquí se mostrarán las asistencias del estudiante.',
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  // Ver notas del curso
  viewGrades(course: any) {
    Swal.fire({
      title: `Notas - ${course.courseName}`,
      text: 'Aquí se mostrarán las calificaciones del estudiante.',
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  // Confirmar y dar de baja al estudiante del curso
  confirmUnenroll(course: any) {
    Swal.fire({
      title: `¿Deseas darte de baja de ${course.courseName}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.unenrollCourse(course);
      }
    });
  }

  // Lógica para eliminar el curso del estudiante
  unenrollCourse(course: any) {
    this.studentCourses = this.studentCourses.filter(c => c.id !== course.id);
    Swal.fire(
      '¡Dado de Baja!',
      `Has sido dado de baja de ${course.courseName}.`,
      'success'
    );
  }
}
