import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClassEnrolled } from 'src/app/models/class-enrolled';
import { ClassesService } from 'src/app/services/classes';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.page.html',
  styleUrls: ['./class-detail.page.scss'],
  standalone: false
})
export class ClassDetailPage implements OnInit {
  classData?: ClassEnrolled;

  constructor(
    private route: ActivatedRoute,
    private classService: ClassesService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.classData = this.classService.getById(id);
  }
}
