export interface Student {
    id: string;
    name: string;
    lastname: string;
    age: number;
    email: string;
    country: string;
    address: string;
    courses?: string[]; // Array para almacenar los IDs de los cursos en los que se inscribe
    grades?: { [courseId: string]: number }; // Notas por curso
    attendance?: { [courseId: string]: string[] }; // Registra fechas de asistencia
     isEditing: boolean;
  }
  
   
  
  
