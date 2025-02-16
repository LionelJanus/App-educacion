import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesFormComponent } from './courses-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CoursesService } from '../../../../../core/services/courses.service';
import { of, throwError } from 'rxjs';
import { Course } from '../models/courses.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../../../shared/shared.module';

describe('CoursesFormComponent', () => {
  let component: CoursesFormComponent;
  let fixture: ComponentFixture<CoursesFormComponent>;
  let coursesServiceMock: jasmine.SpyObj<CoursesService>;

  beforeEach(async () => {
    const serviceMock = jasmine.createSpyObj('CoursesService', ['getCourses', 'addCourse', 'updateCourse', 'deleteCourse']);

    await TestBed.configureTestingModule({
      declarations: [CoursesFormComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatExpansionModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [{ provide: CoursesService, useValue: serviceMock }],
    }).compileComponents();

    coursesServiceMock = TestBed.inject(CoursesService) as jasmine.SpyObj<CoursesService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesFormComponent);
    component = fixture.componentInstance;

    // Simulación de datos iniciales del servicio
    coursesServiceMock.getCourses.and.returnValue(of([
      { id: 'abc123', courseName: 'Angular', description: 'Curso de Angular', duration: 40, teacher: 'John Doe' },
    ]));

    fixture.detectChanges(); // Detecta cambios para inicializar el componente
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.courseForm).toBeDefined();
    expect(component.courseForm.controls['courseName']).toBeDefined();
    expect(component.courseForm.controls['description']).toBeDefined();
    expect(component.courseForm.controls['duration']).toBeDefined();
    expect(component.courseForm.controls['teacher']).toBeDefined();
  });

  it('debería cargar los cursos desde el servicio', () => {
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].courseName).toBe('Angular');
  });

  it('debería agregar un nuevo curso cuando el formulario es válido', () => {
    coursesServiceMock.addCourse.and.returnValue(of({
      id: 'xyz789',
      courseName: 'React',
      description: 'Curso de React',
      duration: 35,
      teacher: 'Jane Doe',
    }));

    component.courseForm.setValue({
      id: 'xyz789',
      courseName: 'React',
      description: 'Curso de React',
      duration: 35,
      teacher: 'Jane Doe',
    });

    component.onSubmit();

    expect(coursesServiceMock.addCourse).toHaveBeenCalled();
    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[1].courseName).toBe('React');
  });

  it('debería mostrar un mensaje de error si falla la carga de cursos', () => {
    spyOn(component, 'openSnackBar');
    coursesServiceMock.getCourses.and.returnValue(throwError(() => new Error('Error al cargar los cursos')));
    
    component.loadCourses();
    
    expect(component.openSnackBar).toHaveBeenCalledWith('Error al cargar los cursos', 'Cerrar');
  });

  it('debería eliminar un curso correctamente', () => {
    coursesServiceMock.deleteCourse.and.returnValue(of(void 0));


    component.deleteCourse(0);

    expect(coursesServiceMock.deleteCourse).toHaveBeenCalledWith('abc123');
    expect(component.dataSource.length).toBe(0);
  });

  it('debería actualizar un curso correctamente', () => {
    const updatedCourse: Course = {
      id: 'abc123',
      courseName: 'Angular Avanzado',
      description: 'Curso avanzado de Angular', // Asegúrate de que este es el valor correcto
      duration: 50, // Asegúrate de que este es el valor correcto
      teacher: 'John Doe',
      isEditing: false
    };
  
    // Simular la respuesta del servicio
    coursesServiceMock.updateCourse.and.returnValue(of(updatedCourse));
  
    // Modificar los valores del curso en el componente
    component.dataSource[0].courseName = 'Angular Avanzado';
    component.dataSource[0].description = 'Curso avanzado de Angular';  // Asegúrate de que este valor coincida
    component.dataSource[0].duration = 50;  // Asegúrate de que este valor coincida
    component.saveEdit(0);
  
    // Verificar si el servicio se ha llamado con los valores correctos
    expect(coursesServiceMock.updateCourse).toHaveBeenCalledWith('abc123', updatedCourse);
  
    // Verificar si los valores en el componente han sido correctamente actualizados
    expect(component.dataSource[0].courseName).toBe('Angular Avanzado');
    expect(component.dataSource[0].description).toBe('Curso avanzado de Angular');  // Asegúrate de que este valor coincida
    expect(component.dataSource[0].duration).toBe(50);  // Asegúrate de que este valor coincida
  });
  
});
