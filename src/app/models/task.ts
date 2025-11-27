// src/app/models/task.model.ts

export type TaskType = 'Prova' | 'Atividade' | 'Trabalho';

export interface TaskItem {
  id: string;             // Document ID
  classId: string;        // ID of the associated Class
  className: string;      // Cached name of the class for display
  taskType: TaskType;     // The category: Prova, Atividade, Trabalho
  taskNumber: number;     // The count within the class/type (e.g., 1 for Prova 1)
  dueDate: string;        // Due date (ISO string or Firestore Timestamp)
  pointsWorth: number;    // Maximum points the task is worth
  pointsReceived?: number; // Grade received (filled upon completion/archiving)
  isCompleted: boolean;   // Status flag for completion
  isArchived: boolean;    // Status flag for archiving
}

// Interface for the data received from the Add Task form
export interface NewTaskForm {
  classId: string;
  taskType: TaskType;
  dueDate: string;
  pointsWorth: number;
}
