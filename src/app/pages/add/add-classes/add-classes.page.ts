// add-classes.page.ts

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ClassesService } from 'src/app/services/classes';
import { NewClassForm } from 'src/app/models/classModel';

@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.page.html',
  styleUrls: ['./add-classes.page.scss'],
  standalone: false,
})
export class AddClassesPage implements OnInit {
  // Use constructor injection since it's non-standalone
  constructor(
    private classService: ClassesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {}

  public classForm!: FormGroup;

  ngOnInit() {
    this.classForm = this.formBuilder.group({
      className: ['', [Validators.required, Validators.minLength(3)]],
      course: ['', [Validators.required, Validators.minLength(3)]],
      university: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  async addClass() {
    if (this.classForm.invalid) return;

    try {
      await this.classService.addClass(this.classForm.value as NewClassForm);

      const toast = await this.toastCtrl.create({
        message: 'Disciplina adicionada com sucesso!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      this.router.navigate(['/classes']);

    } catch (error) {
      console.error('Error adding class:', error);
      const toast = await this.toastCtrl.create({
        message: 'Erro ao adicionar disciplina.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
