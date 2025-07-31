import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  users!: any[];

  constructor(private adminService: AdminService) { }

  ngOnInit() {

    this.adminService.getAllUsers().subscribe(
      users => {
        this.users = users;
      }
    );

  }

  activateUser(user: any) {
    const updatedUser = { ...user, activated: true };

    this.adminService.updateUser(updatedUser).subscribe(
      () => {
        user.activated = true; // Met à jour localement
    });
  }

}
