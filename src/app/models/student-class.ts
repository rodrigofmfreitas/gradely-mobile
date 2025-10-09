import { ClassEnrolled } from "./class-enrolled";
import { Student } from "./student";
import { TestGrade } from "./test-grade";

export interface StudentClass {
  id: number;
  student: Student;
  classEnrolled: ClassEnrolled;
  testGrade: TestGrade[];
}
