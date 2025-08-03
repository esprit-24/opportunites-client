import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ProfilService } from '../../services/profil.service';


@Component({
  selector: 'app-profil-recruteur',
  standalone: true,
  imports: [FormsModule,JsonPipe],
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
