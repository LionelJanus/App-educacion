import { Pipe, PipeTransform } from '@angular/core';
import { Student } from '../../modules/dashboard/pages/students/models/student.model';

@Pipe({
  name: 'studentFilter',
  standalone:false
  
})
export class StudentFilterPipe implements PipeTransform {
  transform(students: Student[], searchText: string): Student[] {
    if (!students || !searchText) {
      return students;
    }
    searchText = searchText.toLowerCase();
    return students.filter((student) =>
      (student.name + ' ' + student.lastname).toLowerCase().includes(searchText)
    );
  }
}