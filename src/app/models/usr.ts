import { Student } from "./student";

export interface Usr {
  id: number;
  email: string;
  pwd: string;
  student: Student;
}
