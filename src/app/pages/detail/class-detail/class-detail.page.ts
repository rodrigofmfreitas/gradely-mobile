// src/app/pages/class-detail/class-detail.page.ts

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, combineLatest } from 'rxjs'; // 👈 Import combineLatest
import { ClassesService } from 'src/app/services/classes';
import { TasksService } from 'src/app/services/tasks.service'; // 👈 Import TasksService
import { ClassItem } from 'src/app/models/classModel';
import { TaskItem } from 'src/app/models/task'; // 👈 Import TaskItem

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
    private classService: ClassesService,
    public taskService: TasksService // 👈 Make service PUBLIC for HTML access
  ) {}

  public classData$!: Observable<ClassItem | null>;
  public classTasks$!: Observable<TaskItem[]>; // 👈 New Observable for tasks
  public classId: string | null = null;

  ngOnInit() {
    this.classId = this.route.snapshot.paramMap.get('id');

    if (this.classId) {
      this.classData$ = this.classService.getClassDetails(this.classId);

      // Fetch all tasks associated with this class ID
      this.classTasks$ = this.taskService.getTasksByClassId(this.classId);

    } else {
      this.classData$ = of(null);
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


// // class-detail.page.ts

// import { Component, OnInit, OnDestroy, inject } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Observable, of } from 'rxjs';
// import { ClassesService } from 'src/app/services/classes';
// import { ClassItem } from 'src/app/models/classModel';

// @Component({
//   selector: 'app-class-detail',
//   templateUrl: './class-detail.page.html',
//   styleUrls: ['./class-detail.page.scss'],
//   standalone: false
// })
// export class ClassDetailPage implements OnInit {
//   // Use constructor injection
//   constructor(
//     private route: ActivatedRoute,
//     private classService: ClassesService
//   ) {}

//   public classData$!: Observable<ClassItem | null>;
//   public classId: string | null = null;

//   ngOnInit() {
//     this.classId = this.route.snapshot.paramMap.get('id');

//     if (this.classId) {
//       // Use the service to fetch the specific class details
//       this.classData$ = this.classService.getClassDetails(this.classId);
//     } else {
//       this.classData$ = of(null);
//     }
//   }
// }
