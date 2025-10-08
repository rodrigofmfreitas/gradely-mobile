import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassesService } from 'src/app/services/classes';

@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.page.html',
  styleUrls: ['./add-classes.page.scss'],
  standalone: false,
})
export class AddClassesPage implements OnInit {
  public multiForm!: FormGroup;

  constructor(
    private classService: ClassesService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.multiForm = this.formBuilder.group({
      firstStep: this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        course: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
      })
    });
  }

  public getFormFirstStep(): FormGroup {
    return this.multiForm.get('firstStep') as FormGroup;
  }

  addClass() {
    const firstStepForm = this.getFormFirstStep();
    if (firstStepForm.valid) {
      const { name, course } = firstStepForm.value;
      this.classService.add({
        name,
        course
      });
      this.router.navigate(['/classes']);
    }
  }

  ngOnInit() { }
}
