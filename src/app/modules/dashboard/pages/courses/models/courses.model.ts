export interface Course {
  id: string; // El id debe ser un string
  courseName: string;
  description: string;
  duration: number;
  teacher: string;
  isEditing?: boolean; // Opcional para habilitar la edición
}