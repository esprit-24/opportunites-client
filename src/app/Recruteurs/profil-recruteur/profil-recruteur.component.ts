import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfilService } from '../../services/profil.service';
import { RecruteurDashboardComponent } from "../recruteur-dashboard/recruteur-dashboard.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profil-recruteur',
  standalone: true,
  imports: [FormsModule,CommonModule, RecruteurDashboardComponent],
  templateUrl: './profil-recruteur.component.html',
  styleUrls: ['./profil-recruteur.component.css']
})
export class ProfilRecruteurComponent implements OnInit {
  profil: any = {};

  constructor(private profilService: ProfilService) {}

  ngOnInit(): void {
    this.profil = this.profilService.getProfil();
  }

  enregistrer() {
    this.profilService.updateProfil(this.profil);
    alert('Profil mis à jour (localement) !');
  }
}
