import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../../services/user/auth.service';
import { InputsStyleService } from '../../services/inputs-style.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: [
    './registration-form.component.css',
    '../login/login.component.css',
  ],
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  passwordSubmitted = false;
  emailSubmitted = false;
  email = false;
  isPasswordHidden = true;
  inputsStyleService = inject(InputsStyleService);
  paswwordDontMatchError: string = '';

  constructor(
    private authService: AuthService,
    private formbuilder: FormBuilder,
    private navigationService: NavigationService
  ) {}
  ngOnDestroy(): void {
    this.passwordSubmitted = false;
    this.emailSubmitted = false;
  }

  hiddeError(isSubmitted: string) {
    if (isSubmitted === 'email') {
      this.emailSubmitted = false;
    }
    if (isSubmitted === 'password') {
      this.passwordSubmitted = false;
    }
  }

  signupForm!: FormGroup;

  ngOnInit(): void {
    // this.navigationService.IsHeaderAndFooterOpen(false, false);

    this.signupForm = this.formbuilder.group({
      email: this.formbuilder.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.formbuilder.control('', [
        Validators.required,
        this.passwordValidator,
        Validators.minLength(8),
        Validators.maxLength(20),
      ]),
      confirmPassword: this.formbuilder.control('', [Validators.required]),
    });
  }
  passwordValidator(control: AbstractControl): Validators | null {
    const password: string = control.value;

    if (!password) {
      return { passwordError: 'לא לשכוח להזין סיסמה' };
    }

    const passwordContainsNumbers = /[0-9]/.test(password);
    const passwordContainsLetters = /[a-zA-Z]/.test(password);

    if (!passwordContainsNumbers || !passwordContainsLetters) {
      return { passwordError: ' נבקש שהסיסמה תכלול אותיות באנגלית וספרות   ' };
    }

    if (password.length < 8 || password.length <= 20) {
      return { passwordError: '  נבקש סיסמה באורך 8-20 תווים ' };
    }

    return null;
  }

  async handleSubmit() {
    const email: string = this.signupForm.get('email')?.value;
    const password: string = this.signupForm.get('password')?.value;
    const confirmPassword: string =
      this.signupForm.get('confirmPassword')?.value;
    this.passwordSubmitted = true;
    this.emailSubmitted = true;

    if (password !== confirmPassword) {
      this.paswwordDontMatchError = 'הסיסמאות אינן תואמות';
      return;
    }

    const loggedIn = await this.authService.register(
      email,
      password,
      confirmPassword
    );

    if (loggedIn) {
      this.inputsStyleService.navigateTomainPage();
    }
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
