export interface Course {
    id: number;
    courseName: string;
    description: string;
    duration: number;
    teacher: string;
    isEditing?: boolean; // Propiedad opcional para saber si el curso está siendo editado
  }
  