// class-detail.page.ts

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ClassesService } from 'src/app/services/classes';
import { ClassItem } from 'src/app/models/classModel';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.page.html',
  styleUrls: ['./class-detail.page.scss'],
  standalone: false
})
export class ClassDetailPage implements OnInit {
  // Use constructor injection
  constructor(
    private route: ActivatedRoute,
    private classService: ClassesService
  ) {}

  public classData$!: Observable<ClassItem | null>;
  public classId: string | null = null;

  ngOnInit() {
    this.classId = this.route.snapshot.paramMap.get('id');

    if (this.classId) {
      // Use the service to fetch the specific class details
      this.classData$ = this.classService.getClassDetails(this.classId);
    } else {
      this.classData$ = of(null);
    }
  }
}
