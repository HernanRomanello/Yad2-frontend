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
  passworError: string = 'לא לשכוח להזין סיסמה';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formbuilder: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.formSubmitted = false;
    // this.authService.IsHeaderAndFooterOpen(true, true);
    // window.location.reload();
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
    this.formSubmitted = true;
    const validLogin = this.areFieldsEmpty(this.signupForm);
    if (password.length < 8) {
      this.passworError = 'נבקש שהסיסמה תכלול אותיות באנגלית וספרות';
      return;
    }
    if (password !== confirmPassword) {
      return;
    }

    this.authService.register(email, password, confirmPassword);
    if (this.signupForm.valid) {
      this.inputsStyleService.navigateTomainPage();
      return;
    }
    if (validLogin) {
      alert('"Registration failed. Please enter all fields correctly."');
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
    const confirmPasswordInput = document.getElementById(
      'confirmPassword'
    ) as HTMLInputElement;
    if (
      passwordInput.type === 'password' ||
      confirmPasswordInput.type === 'password'
    ) {
      passwordInput.type = 'text';
      confirmPasswordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
      confirmPasswordInput.type = 'password';
    }
  }
}
