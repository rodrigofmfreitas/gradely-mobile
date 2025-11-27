// src/app/pages/add/add-task/add-task.page.ts (FIXED)

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TasksService } from 'src/app/services/tasks.service';
import { ClassesService } from 'src/app/services/classes';
import { ClassItem } from 'src/app/models/classModel';
import { NewTaskForm, TaskType } from 'src/app/models/task';
import { Observable, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false
})
export class AddTaskPage implements OnInit {

  // ✅ NEW: Inject ClassesService
  private classService = inject(ClassesService);
  private taskService = inject(TasksService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  taskForm!: FormGroup;
  activeClasses$!: Observable<ClassItem[]>;
  taskTypes = Object.values(TaskType);

  // Store the list of classes locally to easily retrieve the name later
  private classes: ClassItem[] = [];

  constructor() {
    this.taskForm = this.fb.group({
      classId: ['', Validators.required],
      taskType: ['', Validators.required],
      dueDate: ['', Validators.required],
      pointsWorth: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    // 🛑 FIX 1: Call the correct method on the correct service
    this.activeClasses$ = this.classService.getActiveClasses().pipe(
      // ✅ Store the list of classes locally whenever the observable updates
      tap(classes => this.classes = classes)
    );
  }

  async onAddTask() {
    if (this.taskForm.invalid) {
      console.error('Formulário Inválido');
      return;
    }

    // 1. Get the classId from the form
    const formValue = this.taskForm.value as NewTaskForm;
    const selectedClassId = formValue.classId;

    // 2. Look up the className using the stored classes list
    const selectedClass = this.classes.find(c => c.id === selectedClassId);

    if (!selectedClass) {
      console.error('Classe selecionada não encontrada.');
      // Handle error display to the user
      return;
    }

    // 3. 🛑 FIX 2: Pass the required className as the second argument
    try {
      await this.taskService.addTask(
        formValue,
        selectedClass.className // ✅ Pass the className here
      );

      console.log('Tarefa adicionada com sucesso!');
      this.router.navigate(['/tasks']);

    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      // Handle error display
    }
  }

  // Helper method for form date handling (optional, but often useful)
  formatDate(e: any) {
    return new Date(e.detail.value).toISOString().substring(0, 10);
  }
}
