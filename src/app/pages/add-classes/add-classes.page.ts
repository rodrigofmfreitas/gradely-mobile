import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassesService } from 'src/app/services/classes';

@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.page.html',
  styleUrls: ['./add-classes.page.scss'],
  standalone: false,
})
export class AddClassesPage implements OnInit {
  name = "";
  course = "";

  constructor(private classService: ClassesService, private router: Router) { }

  addClass() {
    if (this.name.trim() && this.course.trim()) {
      this.classService.add({
        name: this.name,
        course: this.course
      })
    }
    this.router.navigate(['/classes']);
  }
  ngOnInit() {
  }

}
