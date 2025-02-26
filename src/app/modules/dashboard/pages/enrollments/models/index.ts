import { Course } from '../../courses/models/courses.model';
import { Student } from '../../students/models/student.model';

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  course?: Course;
  student?: Student;
}