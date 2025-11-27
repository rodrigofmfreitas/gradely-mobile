// task-detail.page.ts

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskItem } from 'src/app/models/task';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
  standalone: false
})
export class TaskDetailPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private taskService: TasksService
  ) {}

  public taskData$!: Observable<TaskItem | null>;
  public taskId: string | null = null;

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');

    if (this.taskId) {
      this.taskData$ = this.taskService.getTaskDetails(this.taskId);
    } else {
      this.taskData$ = of(null);
    }
  }
}
