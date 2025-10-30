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
  eventForm: any;

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
    const { name, classEvent, type, date, local } = this.eventForm.value;

this.eventService.add({
  name,
  classEvent,
  type,
  date,  // <-- ADICIONE ESTA LINHA
  local  // <-- ADICIONE ESTA LINHA
});
  }

  ngOnInit() {}
}
