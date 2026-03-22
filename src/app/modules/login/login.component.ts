import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputsStyleService } from '../../services/inputs-style.service';
import { inject } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  formSubmitted = false;
  inputsStyleService = inject(InputsStyleService);
  navigationService = inject(NavigationService);
  isPasswordHidden = true;
  isPasswordIsValid = true;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {}
  ngOnDestroy() {
    this.formSubmitted = false;
  }

  ngOnInit() {
    this.isPasswordHidden = true;
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.formBuilder.control('', Validators.required),
    });
  }
  loginForm!: FormGroup;

  async handleSubmit() {
    this.formSubmitted = true;
    const email: string = this.loginForm.get('email')?.value;
    const password: string = this.loginForm.get('password')?.value;

    const loggedIn = await this.authService.login(email, password);

    if (loggedIn) {
      this.inputsStyleService.navigateTomainPage();
    } else {
      if (
        this.loginForm.get('password')?.valid &&
        this.loginForm.get('email')?.valid
      ) {
        this.isPasswordIsValid = false;
      }
    }
  }

  togglePasswordVisibility() {
    this.isPasswordHidden = !this.isPasswordHidden;
    const passwordInput = document.getElementById(
      'password',
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
}
