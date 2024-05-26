import { Component, OnInit } from '@angular/core';
import { AdvertisementsModel } from '../../shared/models/AdvertisementsModel';
import { UserModel } from '../../shared/models/UserModel';
import { AuthService } from '../../services/user/auth.service';

@Component({
  selector: 'app-user-advertisement',
  templateUrl: './user-advertisement.component.html',
  styleUrl: './user-advertisement.component.css',
})
export class UserAdvertisementComponent implements OnInit {
  constructor(private userService: AuthService) {}

  ngOnInit() {}
}
