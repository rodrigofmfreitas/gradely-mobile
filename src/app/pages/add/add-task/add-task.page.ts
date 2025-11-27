// add-task.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClassesService } from 'src/app/services/classes';
import { TasksService } from 'src/app/services/tasks.service';
import { ClassItem } from 'src/app/models/classModel';
import { NewTaskForm, TaskType } from 'src/app/models/task';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false
})
export class AddTaskPage implements OnInit {

  constructor(
    private taskService: TasksService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {}

  public taskForm!: FormGroup;
  public activeClasses$!: Observable<ClassItem[]>;
  public taskTypes: TaskType[] = ['Prova', 'Atividade', 'Trabalho'];

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      classId: ['', [Validators.required]], // Stores the ID of the selected class
      taskType: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      pointsWorth: [null, [Validators.required, Validators.min(1)]],
    });

    // Load active classes for the dropdown
    this.activeClasses$ = this.taskService.getActiveClassesForForm();
  }

  async addTask() {
    if (this.taskForm.invalid) return;

    try {
      // dueDate from Ionic/Angular forms is often an ISO string, which is fine for Firestore
      await this.taskService.addTask(this.taskForm.value as NewTaskForm);

      const toast = await this.toastCtrl.create({
        message: 'Tarefa adicionada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      this.router.navigate(['/tasks']);

    } catch (error) {
      console.error('Error adding task:', error);
      const toast = await this.toastCtrl.create({
        message: 'Erro ao adicionar tarefa. ' + (error instanceof Error ? error.message : ''),
        duration: 4000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
