import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private formbuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: this.formbuilder.control('', Validators.required),
      password: this.formbuilder.control('', Validators.required),
    });
  }
  loginForm!: FormGroup;

  async handleSubmit() {
    const email: string = this.loginForm.get('email')?.value;
    const password: string = this.loginForm.get('password')?.value;

    const loggedIn = await this.authService.login(email, password);
    if (loggedIn) {
      this.router.navigate(['/']);
    }
  }
}
