export interface Student {
    id: string;
    name: string;
    lastname: string;
    age: number;
    email: string;
    country: string;
    address: string;
    courses?: string[]; // Array para almacenar los IDs de los cursos en los que se inscribe
     isEditing: boolean;
  }
  
   
  
  
