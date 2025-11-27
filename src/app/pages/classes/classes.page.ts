import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ClassesService } from 'src/app/services/classes';
import { TasksService } from 'src/app/services/tasks.service';
import { ClassItem } from 'src/app/models/classModel';
import { Observable, of, switchMap, combineLatest, map } from 'rxjs';

// Define the interface for the computed data structure
interface ComputedClassItem extends ClassItem {
  currentGrade: number; // The sum of pointsReceived (Nota Atual)
}

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
    private tasksService: TasksService, // ✅ NEW: Inject TasksService
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  // Observable to hold the list of active classes with calculated grades
  public activeClasses$: Observable<ComputedClassItem[]> = of([]);

  ngOnInit() {
    // Set the observable to the stream that includes the grade calculation
    this.activeClasses$ = this.getClassesWithGrades();
  }

  ngOnDestroy() {
    // No explicit subscription needed here since we use the async pipe
  }

  /**
   * Fetches active classes and combines them with their tasks to calculate the current grade.
   */
  getClassesWithGrades(): Observable<ComputedClassItem[]> {
    return this.classService.getActiveClasses().pipe(
      // 1. Get the list of all active classes
      switchMap(classes => {
        if (classes.length === 0) {
          return of([]);
        }

        // 2. Map each ClassItem to an Observable that combines it with its tasks and computes the grade
        const computedClasses$ = classes.map(classItem => {
          // Get all tasks for the current class ID
          const classTasks$ = this.tasksService.getTasksByClassId(classItem.id);

          // Combine the class details with its tasks
          return combineLatest([of(classItem), classTasks$]).pipe(
            map(([classDetails, tasks]) => {
              let acquiredPoints = 0;

              tasks.forEach(task => {
                // Grade is calculated only from ARCHIVED tasks that have a defined pointsReceived
                if (task.isArchived && task.pointsReceived !== undefined) {
                  acquiredPoints += task.pointsReceived;
                }
              });

              // Return the class object extended with the calculated grade
              return {
                ...classDetails,
                currentGrade: acquiredPoints, // Nota Atual
              } as ComputedClassItem;
            })
          );
        });

        // 3. Combine all computed class observables into a single array stream
        // This ensures the main list updates whenever any class or task changes
        return combineLatest(computedClasses$);
      })
    );
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
