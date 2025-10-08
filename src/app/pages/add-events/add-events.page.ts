import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events';

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.page.html',
  styleUrls: ['./add-events.page.scss'],
  standalone: false,
})
export class AddEventsPage implements OnInit {
  public multiForm!: FormGroup;

  constructor(
    private eventService: EventsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.multiForm = this.formBuilder.group({
      firstStep: this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        classEvent: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        type: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      })
    });
  }

  public getFormFirstStep(): FormGroup {
    return this.multiForm.get('firstStep') as FormGroup;
  }

  addEvent() {
    const firstStepForm = this.getFormFirstStep();
    if (firstStepForm.valid) {
      const { name, classEvent, type } = firstStepForm.value;
      this.eventService.add({
        name,
        classEvent,
        type
      });
      this.router.navigate(['/events']);
    }
  }

  ngOnInit() {}
}
