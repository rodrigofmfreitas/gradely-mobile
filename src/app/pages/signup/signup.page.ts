import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage {
  form: FormGroup;
  auth = getAuth();

  constructor(private fb: FormBuilder, private navCtrl: NavController) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async register() {
    const { email, password } = this.form.value;
    try {
      const success = await createUserWithEmailAndPassword(this.auth, email, password);
      // alert('Conta criada com sucesso!');
      if (success)
        this.navCtrl.navigateRoot('/user-info');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Erro ao criar conta.');
    }
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
