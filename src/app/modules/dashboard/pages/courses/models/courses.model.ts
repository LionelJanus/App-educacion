

export interface Course {
  id: string; // El id debe ser un string
  courseName: string;
  description: string;
  duration: number;
  teacher: string;
  courseDays: string[]   // Días de curso (por ejemplo, "Lunes, Miércoles")
  startTime: string;    // Hora de inicio (formato HH:mm)
  endTime: string;      // Hora de finalización (formato HH:mm)
  enrolledUsers: string[];
  isEditing?: boolean;  // Opcional para habilitar la edición
}
