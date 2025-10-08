import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Class } from 'src/app/models/class';
import { ClassesService } from 'src/app/services/classes';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
  standalone: false,
})
export class ClassesPage implements OnInit {
  classes: Class[] = []

  constructor(private classesService: ClassesService, private router: Router) { }

  ionViewWillEnter() {
    this.classes = this.classesService.getAll();
  }

  goToAddClass() {
    this.router.navigate(['/add-classes']);
  }

  finalize(id: number) {
    this.classesService.delete(id);
    this.classes = this.classesService.getAll();
  }

  getDetail(id: number) {
    this.router.navigate(['/class-detail', id]);
  }

  ngOnInit() {
    this.classes = this.classesService.getAll();
  }

}
