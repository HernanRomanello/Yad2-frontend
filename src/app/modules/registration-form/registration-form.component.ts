import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';
import { InputsStyleService } from '../../services/inputs-style.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: [
    './registration-form.component.css',
    '../login/login.component.css',
  ],
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  formSubmitted = false;
  isPasswordHidden = true;
  inputsStyleService = inject(InputsStyleService);

  constructor(
    private router: Router,
    private authService: AuthService,
    private formbuilder: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.formSubmitted = false;
    this.authService.IsHeaderAndFooterOpen(true, true);
  }

  signupForm!: FormGroup;

  ngOnInit(): void {
    this.authService.IsHeaderAndFooterOpen(false, false);

    this.signupForm = this.formbuilder.group({
      email: this.formbuilder.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.formbuilder.control('', [
        Validators.required,
        this.passwordValidator,
      ]),
      confirmPassword: this.formbuilder.control('', Validators.required),
    });
  }
  passwordValidator(control: AbstractControl): Validators | null {
    const password: string = control.value;

    if (!password) {
      return { passwordError: 'Please enter a password' };
    }

    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return strongPasswordPattern.test(password)
      ? null
      : { passwordError: 'Password is not strong enough' };
  }

  async handleSubmit() {
    const email: string = this.signupForm.get('email')?.value;
    const password: string = this.signupForm.get('password')?.value;
    const confirmPassword: string =
      this.signupForm.get('confirmPassword')?.value;
    const validLogin = this.areFieldsEmpty(this.signupForm);
    const user = {
      Email: email,
      Password: password,
      ConfirmPassword: confirmPassword,
    };
    if (password !== confirmPassword) {
      // alert('Passwords do not match');
      return;
    }

    this.authService.register(email, password, confirmPassword);
    this.formSubmitted = true;
    if (this.signupForm.valid) {
      this.router.navigate(['/']);
      return;
    }
    if (validLogin) {
      // alert('"Registration failed. Please enter all fields correctly."');
      return;
    }
  }

  areFieldsEmpty(form: FormGroup): boolean {
    for (const controlName in form.controls) {
      const control = form.get(controlName);
      if (control && control.value.trim() === '') {
        return true;
      }
    }
    return false;
  }

  togglePasswordVisibility() {
    this.isPasswordHidden = !this.isPasswordHidden;
    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
}
