// classes.page.ts

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ClassesService } from 'src/app/services/classes';
import { ClassItem } from 'src/app/models/classModel';
import { Observable, Subscription, of } from 'rxjs';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
  standalone: false
})
export class ClassesPage implements OnInit, OnDestroy {
  // Use constructor injection
  constructor(
    private classService: ClassesService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  // Observable to hold the list of active classes
  public activeClasses$: Observable<ClassItem[]> = of([]);

  ngOnInit() {
    // Fetch active classes using the service
    this.activeClasses$ = this.classService.getActiveClasses();
  }

  ngOnDestroy() {
    // No explicit subscription needed here since we use the async pipe
  }

  goToDetails(classId: string) {
    this.router.navigate(['/class-detail', classId]);
  }

  async finalizeClass(classId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Finalizar Disciplina',
      message: 'Tem certeza de que deseja fechar esta disciplina e arquivá-la?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Finalizar',
          handler: async () => {
            try {
              await this.classService.finalizeClass(classId);

              const toast = await this.toastCtrl.create({
                message: 'Disciplina finalizada!',
                duration: 2000,
                color: 'success'
              });
              toast.present();
              // The classes$ observable updates automatically!
            } catch (error) {
              console.error('Error finalizing class:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
