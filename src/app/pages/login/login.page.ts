import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth'; // adjust path if needed

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async submit() {
    const { username, password } = this.form.value;

    const success = await this.authService.login(username, password);

    if (success) {
      this.navCtrl.navigateRoot('/profile');
    } else {
      alert('Usuário ou senha inválidos.');
    }
  }

  async loginWithGoogle() {
    try {
      // optional — if you added Google login in AuthService
      await this.authService.loginWithGoogle?.();
      this.navCtrl.navigateRoot('/profile');
    } catch (error) {
      console.error('Erro ao autenticar com Google:', error);
      alert('Erro ao autenticar com Google.');
    }
  }

  goToSignup() {
    this.navCtrl.navigateForward('/signup');
  }
}
