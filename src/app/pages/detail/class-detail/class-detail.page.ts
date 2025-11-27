// src/app/pages/class-detail/class-detail.page.ts

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, combineLatest, map, filter } from 'rxjs';
import { ClassesService } from 'src/app/services/classes';
import { TasksService } from 'src/app/services/tasks.service';
import { ClassItem } from 'src/app/models/classModel';
import { TaskItem } from 'src/app/models/task';

interface ComputedClassItem extends ClassItem {
  currentGrade: number; // The sum of pointsReceived (Nota Atual)
  totalPointsPossible: number;
}

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.page.html',
  styleUrls: ['./class-detail.page.scss'],
  standalone: false
})


export class ClassDetailPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classService: ClassesService, // Gets class data
    public taskService: TasksService      // Gets task data
  ) {}

  public computedClass$!: Observable<ComputedClassItem | null>;
  public classTasks$!: Observable<TaskItem[]>;
  public classId: string | null = null;

  ngOnInit() {
    this.classId = this.route.snapshot.paramMap.get('id');

    if (this.classId) {
      const classDetails$ = this.classService.getClassDetails(this.classId).pipe(
        filter((data): data is ClassItem => !!data) // Ensure we have class data
      );

      // Fetch all tasks associated with this class ID
      this.classTasks$ = this.taskService.getTasksByClassId(this.classId);

      // Combine Class Details and Tasks to compute the grade
      this.computedClass$ = combineLatest([classDetails$, this.classTasks$]).pipe(
        map(([classDetails, tasks]) => {
          let acquiredPoints = 0;

          tasks.forEach(task => {
            // Only tasks marked as ARCHIVED should contribute to the final grade sum.
            // We use pointsReceived because that is the actual grade received by the student.
            if (task.isArchived && task.pointsReceived !== undefined) {
              acquiredPoints += task.pointsReceived;
            }
          });

          // Return the class details merged with the computed currentGrade
          return {
            ...classDetails,
            currentGrade: acquiredPoints, // This is your Nota Atual
            // totalPointsPossible: totalPossible  <-- You can add this if needed later
          } as ComputedClassItem;
        })
      );

    } else {
      this.computedClass$ = of(null);
      this.classTasks$ = of([]);
    }
  }


  // --- Methods for Task Actions (Reuse logic from tasks.page.ts) ---

  // Note: For simplicity, we are redirecting the user to the main Task Detail page.
  // We don't need to duplicate the full archive/complete logic here unless requested.
  goToTaskDetails(taskId: string) {
    // You can navigate directly to the task details from here
    this.router.navigate(['/task-details', taskId]);
  }
}
