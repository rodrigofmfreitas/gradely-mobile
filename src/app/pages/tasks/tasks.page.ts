// tasks.page.ts

import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskItem } from 'src/app/models/task';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false
})
export class TasksPage implements OnInit {

  constructor(
    public taskService: TasksService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  public tasks$!: Observable<TaskItem[]>;

  ngOnInit() {
    this.tasks$ = this.taskService.getTasks();
  }

  // --- Action Handlers ---

  goToDetails(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }

  async markAsCompleted(task: TaskItem) {
    if (task.isCompleted) return;

    try {
      await this.taskService.completeTask(task.id);

      const toast = await this.toastCtrl.create({
        message: `Tarefa ${task.taskType} ${task.taskNumber} marcada como concluída!`,
        duration: 2000,
        color: 'blue'
      });
      toast.present();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }

  async archiveTask(task: TaskItem) {
    const alert = await this.alertCtrl.create({
      header: 'Arquivar Tarefa',
      message: `Digite a nota obtida (máx: ${task.pointsWorth} pts):`,
      inputs: [
        {
          name: 'pointsReceived',
          type: 'number',
          placeholder: 'Nota Recebida',
          min: '0',
          max: task.pointsWorth.toString()
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Arquivar',
          handler: async (data) => {
            const points = parseFloat(data.pointsReceived);

            if (isNaN(points) || points < 0 || points > task.pointsWorth) {
              const errorToast = await this.toastCtrl.create({
                message: `Nota inválida. Deve ser entre 0 e ${task.pointsWorth}.`,
                duration: 3000,
                color: 'danger'
              });
              errorToast.present();
              return false; // Prevent alert from closing
            }

            try {
              await this.taskService.archiveTask(task.id, points);
              const toast = await this.toastCtrl.create({
                message: 'Tarefa arquivada e nota salva!',
                duration: 2000,
                color: 'success'
              });
              toast.present();
              return true;
            } catch (error) {
              console.error('Error archiving task:', error);
              return true;
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
