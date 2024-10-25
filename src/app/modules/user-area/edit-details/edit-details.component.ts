import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../shared/models/UserModel';
import { AuthService } from '../../../services/user/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css'], // Corrected to 'styleUrls'
})
export class EditDetailsComponent implements OnInit {
  $user = new BehaviorSubject<UserModel | null>(null);

  constructor(private userService: AuthService) {}

  async ngOnInit() {
    this.$user = this.userService.user as BehaviorSubject<UserModel | null>;
  }
}
