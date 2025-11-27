// src/app/models/class.model.ts

export interface ClassItem {
  id: string;             // Document ID from Firestore (used for routing)
  university: string;     // University name
  className: string;      // Name of the specific class/discipline (e.g., 'Mobile Dev')
  course: string;         // Name of the course (e.g., 'Computer Science')
  currentGrade: number;   // Current calculated grade (starts at 0)
  isCompleted: boolean;   // Status flag for archiving/finalizing (false = Active)
}

// Interface for the data received from the Add Class form
export interface NewClassForm {
  university: string;
  className: string;
  course: string;
}
