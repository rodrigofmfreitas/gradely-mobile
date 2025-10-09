import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [true],
    });
  }

  submit() {
    const { username, password } = this.form.value;

    if (this.auth.login(username, password)) {
      this.router.navigate(['/profile']); // ✅ redirect to main page
    } else {
      alert('Usuário ou senha inválidos');
    }
  }
}
