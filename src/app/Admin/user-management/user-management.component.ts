import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { AdminService } from '../../services/admin.service';

declare var bootstrap: any;


@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

  users!: User[];
  selectedUser: any;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  // Méthode pour charger tous les utilisateurs
  getAllUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    });
  }

  // Méthode pour afficher les détails d'un utilisateurselectedUser?: User;
  detailsUser(user: User): void {
    this.selectedUser = user;
    console.log('Détails de l\'utilisateur:', user);
    //const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    //modal.show();
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(user: User): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      this.adminService.deleteUser(user).subscribe({
        next: () => {
          alert(`Utilisateur ${user.firstName} ${user.lastName} supprimé avec succès.`);

          this.getAllUsers(); // Recharge la liste des utilisateurs
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur:', error);
          alert(`Erreur lors de la suppression de l'utilisateur ${user.firstName} ${user.lastName}.`);
        }
      });
    }
  }

  // Méthode pour activer/désactiver un utilisateur
  toggleActivation(user: User): void {
    // Empêcher la désactivation des administrateurs
    if (user.activated && this.hasRole(user, 'ROLE_ADMIN')) {
      alert("Impossible de désactiver un administrateur.");
      return;
    }

    const action = user.activated ? 'désactiver' : 'activer';
    const confirmed = confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur ${user.firstName} ${user.lastName} ?`);
    
    if (!confirmed) return;

    const updatedUser = { ...user, activated: !user.activated };

    this.adminService.updateUser(updatedUser).subscribe({
      next: () => {
        user.activated = updatedUser.activated; // Mise à jour locale
        const msg = updatedUser.activated ? 'activé' : 'désactivé';
        alert(`Utilisateur ${user.firstName} ${user.lastName} ${msg} avec succès.`);
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut :', err);
        alert(`Erreur lors de la tentative de ${action} l'utilisateur.`);
      }
    });
  }


  getUserRoleLabel(authorities: string[]): string {
    if (authorities.includes('ROLE_ADMIN')) return 'Admin';
    if (authorities.includes('ROLE_RECRUTEUR')) return 'Recruteur';
    if (authorities.includes('ROLE_CANDIDAT')) return 'Candidat';
    return 'Utilisateur';
  }

  getUserRoleBadgeClass(authorities: string[]): string {
    if (authorities.includes('ROLE_ADMIN')) return 'badge bg-danger';
    if (authorities.includes('ROLE_RECRUTEUR')) return 'badge bg-primary';
    if (authorities.includes('ROLE_CANDIDAT')) return 'badge bg-success';
    return 'badge bg-secondary';
  }

  hasRole(user: any, role: string): boolean {
    if (!user || !user.authorities) return false;
    return user.authorities.includes(role);
  }

}
